(function () {
    $(function () {
        if(localStorage['cookies'] === undefined) {
            // Europe Cookie Consent Law - shows for all visitors as GeoBytes sometimes doesn't work
            $('head').append('<style>#cookielaw-text {z-index:-1;position:absolute;left:40px;font-size:21px;height:27px;line-height:24px;z-index:99999;} #cookielaw {position:fixed;bottom:0;right:0;width:100%;font-size:18px;line-height:18px;padding:12px;background:#FC9C35;color:black;z-index:99999;}</style>');
            
            $('body').prepend('<div id="cookielaw"><div id="cookielaw-text" style="z-index: -1;">We use cookies on this site. Our <a href="https://opensprites.org/privacy/" style="color:white;">Privacy Policy</a> outlines how we use cookies and what they are.</div><a href="javascript:void(0)" onclick="$(\'#cookielaw\').fadeOut(300);localStorage[\'cookies\'] = true;" class="btn blue" style="float: right; width: 100px; text-align:center;color:#000;">Close</a></div>');
        }
    });
})();
