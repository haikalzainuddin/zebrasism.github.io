let $;
$ = require('jquery');

require('dotenv').config({path: '/.env'})


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, docs, addDoc, getDoc, query } from "firebase/firestore";

import firebase from 'firebase/app';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCXlqNOycNN2cVqKCNEoXts7g_qHqRppBE",
authDomain: "innvyte.firebaseapp.com",
projectId: "innvyte",
storageBucket: "innvyte.appspot.com",
messagingSenderId: "125215306662",
appId: "1:125215306662:web:034a2cf726c5f516695567",
measurementId: "G-R71EH809WL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firestore = getFirestore();

const guestsList = doc(firestore, 'guests/igvIbV8o4QkfVNu6pTVf')

$(function(){

    $(document).ready(function(){
        if (window.location.href == "https://invyte.digital/") {
            window.location = "https://invyte.digital/HaikalHanna"
        }
        showPartners()
        popupLinks();
        pageLoad();
        console.log(process.env.S3_BUCKET) 
        if ($('.invite-links').length) {
            stickyNav();
        }
        if ($('.guests_page').length) {
            let pass = prompt("Enter Password")
            if (pass == "sub@ng_PJ2022") {
                getGuestList()
                guestsSort()
                dropDown()
            } else {
                window.location = "/HaikalHanna"
            }
        }
    })

    $('#rsvpForm').submit(function(e){
        e.preventDefault();
        submitForm()
    })

    function pageLoad() {
        setTimeout(function(){
            $('.page-loader').addClass('hide-this')
        }, 1500)
        setTimeout(function(){
            $('.invite-page').removeClass('hide-this')
        }, 1700)
    }

    function stickyNav() {
        let cardBack = $('.invite-card.back')
        let cardBackPosition = cardBack.position().top + cardBack.outerHeight(true);
        let windowHeight = $(window).height();
        $(window).scroll(function(){
            let _this = $(this)
            if (_this.scrollTop() + windowHeight < cardBackPosition - 100) {
                $('.invite-links').removeClass('sticky')
            } else {
                $('.invite-links').addClass('sticky')
            }
            if (_this.scrollTop() > 50) {
                $('.invite-links').addClass('show-this')
            } else {
                $('.invite-links').removeClass('show-this')
            }
        })
    }

    function showPartners() {
        let amount = $(".form-row.controlled")
        let pax = $('.pax')
        let child = $('.children')
        $("#status").change(function(){
            let _this = $('#status').val()
            if (_this == "attending") {
                amount.removeClass('hide-this')
                pax.attr('required', true)
                child.attr('required', true)
            } else {
                amount.addClass('hide-this')
            }
        })
    }

    function popupLinks() {
        if ($('.popup-btn').length) {
            let open_popup = $('.popup-btn')
            open_popup.on('click touchend', function(e){
                let _this = $(this)
                e.preventDefault();
                _this.addClass('active')
                $('body').addClass('ovh')
                $($(`.popup[data-popup=${_this.data().popup}]`)).addClass('show-this').css('top', $(window).scrollTop())
            })
        }
        if ($('.popup').length) {
            let close_popup = $('.popup-close')
            close_popup.on('click', function(){
                $('body').removeClass('ovh')
                $(this).closest('.popup').removeClass('show-this')
                $('.popup-btn.active').removeClass('active')
            }) 

            $("body").click(function() {
                $('body').removeClass('ovh')
                $('.popup.show-this').removeClass('show-this')
                $('.popup-btn.active').removeClass('active')
              });
              $(".popup-content").click(function(e) {
                e.stopPropagation();
              });
              $(".popup-btn").click(function(e) {
                e.stopPropagation();
              });
        }
    }

    async function submitForm() {
        let status = $('.status').val();
        let form = $('#rsvpForm');
        let loader = $('.loader-overlay');
        let submitMessage = $('.form-submit-message');

        const guestData = { 
            name: $('.name').val(),
            phone: $('.phone').val(),
            status: $('.status').val(),
            pax: $('.pax').val(),
            children: $('.children').val(),
            guest_of: $('.guest').val(),
            message: $('.message').val(),
        }

        try {
            await setDoc(doc(db, 'guests',  $('.name').val()), guestData)

            form.addClass('fade-this')
            loader.addClass('show-this')

            setTimeout(function(){
                form.remove();
                loader.remove();
                submitMessage.addClass('show-this')
            }, 1000)

        } catch (error) {
            console.log('Something wrong submitting the form. Please contact Haikal')
        }
    }

    async function getGuestList() {

        let pax = []
        let status = []
        let children = []

        // get guests list
        const getGuestList1 = query(
            collection(firestore, 'guests')
        )

        $('.guests_page').removeClass('hide-page')

        const querySnapshot = await getDocs(getGuestList1)

        // end - get guests list

        // append list to page

        let guestList = $('#guests-list .guests-list-wrapper')

        const allDocs = querySnapshot.forEach((guest) => {
            let data = guest.data()
            let status_pax = ""
            let status_children = ""

            pax.push(data.pax),
            children.push(data.children),
            status.push(data.status)

            if (status == "not-attending") {
                status_pax = "-"
                status_children = "-"
            } else {
                if (data.pax != "") {
                    status_pax = data.pax
                } else {
                    status_pax = 0
                }
                if (data.children != "") {
                    status_children = data.children
                } else {
                    status_children = 0
                }
            }

            guestList.append(
                `<div class="row row-data">
                    <span>${data.name}</span>
                    <span>${data.phone}</span>
                    <span class="status">${data.status.replace('-', ' ')}</span>
                    <span class="individual_amount">${status_pax}</span>
                    <span class="individual_children">${status_children}</span>
                    <span class="guest_of">${data.guest_of}</span>
                    <span>${data.message}</span>
                </div>`
            )
        })

        calcPax(status, pax, children)


        // end - append list to page

    }

    async function calcPax(status, pax, children) {
        let totalpax = 0
        let totalchild = 0
        let totalpax_box = $('.totalpax-amount')
        let totalchildren_box = $('.totalchildren-amount')

        for (let i = 0; i<pax.length; i++) {
            if (status[i] !== "not-attending") {
                if (pax[i] !== "") {
                    totalpax = totalpax + parseInt(pax[i])
                } else {
                    totalpax = totalpax + 0
                }
                if (children[i] !== "") {
                    totalchild = totalchild + parseInt(children[i])
                } else {
                    totalchild = totalchild + 0
                }
                
            }
        }

        totalpax_box.append(totalpax)
        totalchildren_box.append(totalchild)
    }

    function dropDown() {
        let dropdown = $('.dropdown')

        dropdown.each(function(){
            let _this = $(this)
            let dd_btn = _this.find('.dropdown-btn')
            let dd_box = _this.find('.dropdown-box')

            dd_btn.click(function(e){
                e.preventDefault()
                dd_box.toggleClass('show-this')
            })
        })
    }

    function guestsSort() {
        let sortStatus = $('.sort-status a')
        let sortGuestOf = $('.sort-guestof a')

        sortStatus.on('click', function(e){
            let data_row = $('.guests-list .row-data')
            e.preventDefault();
            $('.total_individual').hide();
            let _this = $(this)
            let stat = _this.data().status.replace('-', ' ')
            
            _this.parent().parent().siblings().find('.dropdown-btn span').text("All")
            _this.parent().removeClass('show-this')
            _this.parent().parent().find('.dropdown-btn span').text(_this.text())
            if (stat == "All") {
                data_row.each(function(){
                    $(this).show();
                })
            } else {
                data_row.each(function(){
                    $(this).show();
                    if ($(this).find('.status').text() != stat) {
                        $(this).hide();
                    }
                })
            }
        })

        sortGuestOf.on('click', function(e){
            let data_row = $('.guests-list .row-data')
            e.preventDefault();
            let _this = $(this)
            let guestof = _this.data().guestof
            let individual = $('.total_individual')
            let amount = 0;
            let children = 0

            _this.parent().parent().siblings().find('.dropdown-btn span').text("All")
            _this.parent().removeClass('show-this')
            _this.parent().parent().find('.dropdown-btn span').text(_this.text())
            if (guestof == "All") {
                data_row.each(function(){
                    $(this).show();
                })
                individual.hide();
            } else {
                data_row.each(function(){
                    $(this).show();
                    if ($(this).find('.guest_of').text() != guestof) {
                        $(this).hide();
                    } else {
                        if ($(this).find('.individual_amount').text() != "-") {
                            amount = amount + parseInt($(this).find('.individual_amount').text())
                        } else {
                            amount = amount + 0;
                        }
                        if ($(this).find('.individual_children').text() != "-") {
                            children = children + parseInt($(this).find('.individual_children').text())
                        } else {
                            children = children + 0;
                        }
                    }
                })
                individual.show();
                individual.find('.pax_name').text(guestof)
                individual.find('.pax_amount').text(amount)
                individual.find('.pax_child').text(children)
            }
        })
    }
})