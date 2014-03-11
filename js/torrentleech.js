$(document).ready(function() {
    /* Hook up quick download links */
    $('td.quickdownload > a').on('click', function(e) {
        e.preventDefault();
        console.log($(this).attr('href'));
    });
});