require('./index.css')
require('common/css/reset.css')
var Public = require('common/js/public.js')
Public.getApp()

var app = new Vue({
    el: "#app",
    data: {
        msg: "hellow ORD"
    }
})


axios.get('http://wcvote.5260wawa.com/wcvote/newVote/hisVotes', {
        params: {
            userId: ''
        }
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });