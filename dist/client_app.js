import bootstrap from './bootstrap/dist/js/bootstrap.js';

import './jquery/dist/jquery.min.js';
import './local_lib/MeboryClient.js';

let meboryClient = new MeboryClient('C_34e7fe65-018f-1000-a264-c7691938a0f2', 'mebory-login', 'https://login.mebory.com');

const removeAllChildElementsById = (id) => {
    const element = document.getElementById(id);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

meboryClient.afterLogin = () => {
    document.getElementById("login-button-row").hidden = true;
    document.getElementById("card-img-row").hidden = false;
    document.getElementById("title-desc-row").hidden = false;
    document.getElementById("point-row").hidden = false;
    document.getElementById("stamp-row").hidden = false;
    document.getElementById("function-button-row").hidden = false;
    document.getElementById("bluespace").hidden = false;

    removeAllChildElementsById('card-img-row');
    var cardImg = $('<img>').attr({
        class: 'cardimg',
        src: meboryClient.title_front_cover(),
        alt: '会員証'
    });
    cardImg.appendTo('#card-img-row');

    $('#title-desc').text(meboryClient.mebory['description']);

    if (meboryClient.mebory['titleUITemplete'] !== 1 && meboryClient.mebory['titleUITemplete'] !== 3) {
        document.getElementById("point-row").hidden = false;
        meboryClient.getPoint(
                function () {},
                function () {},
                (point) => {
            $('#show-point').text(point);
        });
        meboryClient.getVoucher(
            function () {},
            function () {},
            (data) => {
        console.log(data);
    });
    } else {
        document.getElementById("point-row").hidden = true;
    }

    if (meboryClient.mebory['titleUITemplete'] === 3) {
        removeAllChildElementsById('stamp-ui-block');
        meboryClient.getStamp(
                function () {},
                function () {},
                (stamp) => {
            var total = 0;
            var stampped = 0;
            stamp.forEach(
                    (element) => {
                total++;
                var imgSrc = 'images/defaultstamp.png';
                if (element.eventVisualConcept !== '') {
                    imgSrc = meboryClient.title_event_visual_concept_by_id(element.eventBelongTo, element.eventId);
                }
                if (element.id !== '0') {
                    var stampImg = $('<img>').attr({
                        class: 'filled-stamp-slot',
                        src: imgSrc,
                        alt: 'スタンプ'
                    });
                    stampImg.appendTo('#stamp-ui-block');
                } else {
                    var stampImg = $('<img>').attr({
                        class: 'empty-stamp-slot',
                        src: imgSrc,
                        alt: 'スタンプ'
                    });
                    stampImg.appendTo('#stamp-ui-block');
                }
            }
            );
        });
    }
};

meboryClient.refreshSucceed = () => {
};
meboryClient.refreshFailed = () => {
    document.getElementById("login-button-row").hidden = false;
    document.getElementById("card-img-row").hidden = true;
    document.getElementById("title-desc-row").hidden = true;
    document.getElementById("point-row").hidden = true;
    document.getElementById("stamp-row").hidden = true;
    document.getElementById("function-button-row").hidden = true;
    document.getElementById("bluespace").hidden = true;
};


meboryClient.refresh();

document.getElementById("get-code").onclick = function () {
    meboryClient.getCode(
            function () {},
            function () {},
            (code) => {
        console.log('Code => ' + code);
        document.getElementById("short-code-in-toast").innerHTML = code;
        const toast = new bootstrap.Toast('#short-code-toast');
        toast.show();
    });
};

document.getElementById("reload").onclick = function () {
    meboryClient.refresh();
};

document.getElementById("mebory-get-voucher").onclick = function () {
    meboryClient.getVoucher(
            function () {},
            function () {},
            (data) => {
        console.log(data);
    });
};