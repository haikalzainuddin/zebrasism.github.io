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
        if ($('.guests-list').length) {
            getGuestList()
        }
    })

    if ($('.invitation-page').length) {
        invitationFooter();
    }

    $('#rsvpForm').submit(function(e){
        e.preventDefault();
        submitForm()
    })

    function invitationFooter() {
        var popup_btn = $('.invitation-btns a'),
            popup_box = $('.invitation-popup'),
            popup_close = $('.popup-close')

        popup_btn.on('click', function(e){
            e.preventDefault();
            var _this = $(this),
                content = _this.data('trigger')

            popup_box.each(function(){
                $(this).removeClass('show-popup')
                if ($(this).data('popup') == content) {
                    $(this).addClass('show-popup')
                }
            })
        })

        popup_close.on('click', function(e){
            $(this).parent().parent().removeClass('show-popup')
        })
    }

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

    function submitForm() {
        const newDoc = setDoc(doc(db, 'guests',  $('.name').val()), { 
            name: $('.name').val(),
            phone: $('.phone').val(),
            email: $('.email').val(),
            status: $('.status').val(),
            pax: $('.pax').val(),
            message: $('.message').val(),
        });
    }

    async function getGuestList() {

        let pax = []

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

            pax.push(data.pax)

            guestList.append(
                `<div class="row">
                    <span>${data.name}</span>
                    <span>${data.phone}</span>
                    <span>${data.email}</span>
                    <span>${data.status}</span>
                    <span>${data.pax}</span>
                    <span>${data.message}</span>
                </div>`
            )
        })

        calcPax(pax)

        // end - append list to page

    }

    async function calcPax(pax) {
        let totalpax = 0
        let totalpax_box = $('.totalpax-amount')

        for (let i = 0; i<pax.length; i++) {
            var eee = parseInt(pax[i])
            console.log(typeof eee)
            totalpax = totalpax + parseInt(pax[i])
        }

        totalpax_box.append(totalpax)
    }
})