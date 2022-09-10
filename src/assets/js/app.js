var $;
$ = require('jquery');

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
        showPartners()
        popupLinks();
        if ($('.guests-list').length) {
            getGuestList()
        }
    })

    $('#rsvpForm').submit(function(e){
        e.preventDefault();
        submitForm()
    })

    function showPartners() {
        var partners = $("#partners")
        $("#status").change(function(){
            var _this = $('#status').val()
            if (_this == "attending") {
                partners.addClass('show-this')
            } else {
                partners.removeClass('show-this')
            }
        })
    }

    function popupLinks() {
        if ($('.popup-btn').length) {
            let open_popup = $('.popup-btn')
            open_popup.on('click', function(e){
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
            guest_of: $('.guest').val(),
            message: $('.message').val(),
        }

        try {
            await setDoc(doc(db, 'guests',  $('.name').val()), guestData)

            form.addClass('fade-this')
            loader.addClass('show-this')

            console.log(status)

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

        // get guests list
        const getGuestList1 = query(
            collection(firestore, 'guests')
        )

        const querySnapshot = await getDocs(getGuestList1)

        // end - get guests list

        // append list to page

        let guestList = $('#guests-list')

        const allDocs = querySnapshot.forEach((guest) => {
            let data = guest.data()
            let status_pax = ""

            pax.push(data.pax),
            status.push(data.status)

            if (status == "not-attending") {
                status_pax = "-"
            } else {
                status_pax = data.pax
            }

            guestList.append(
                `<div class="row">
                    <span>${data.name}</span>
                    <span>${data.phone}</span>
                    <span>${data.status.replace('-', ' ')}</span>
                    <span>${status_pax}</span>
                    <span>${data.guest_of}</span>
                    <span>${data.message}</span>
                </div>`
            )
        })

        calcPax(status, pax)

        // end - append list to page

    }

    async function calcPax(status, pax) {
        let totalpax = 0
        let totalpax_box = $('.totalpax-amount')

        for (let i = 0; i<pax.length; i++) {
            if (status[i] == "not-attending") {
                var eee = parseInt(pax[i])
                totalpax = totalpax + parseInt(pax[i])
            }
        }

        totalpax_box.append(totalpax)
    }
})