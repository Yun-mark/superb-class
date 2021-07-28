  $('.choose').click(function () {
        $('.choose').addClass('active');
        $('.choose > .icon').addClass('active');
        $('.pay').removeClass('active');
        $('.wrap').removeClass('active');
        $('.pay > .icon').removeClass('active');
        $('.wrap > .icon').removeClass('active');
        $('.ship > .icon').removeClass('active');
        $('#line').addClass('one');
        $('#line').removeClass('two');
        $('#line').removeClass('three');
    });
    $('.pay').click(function () {
        $('.pay').addClass('active');
        $('.pay > .icon').addClass('active');
        $('.choose').removeClass('active');
        $('.wrap').removeClass('active');
        $('.choose > .icon').removeClass('active');
        $('.wrap > .icon').removeClass('active');
        $('#line').addClass('two');
        $('#line').removeClass('one');
        $('#line').removeClass('three');
    });
    $('.wrap').click(function () {
        $('.wrap').addClass('active');
        $('.wrap > .icon').addClass('active');
        $('.pay').removeClass('active');
        $('.choose').removeClass('active');
        $('.pay > .icon').removeClass('active');
        $('.choose > .icon').removeClass('active');
        $('.ship > .icon').removeClass('active');
        $('#line').addClass('three');
        $('#line').removeClass('two');
        $('#line').removeClass('one');
    });
    $('.choose').click(function () {
        $('#first').addClass('active');
        $('#second').removeClass('active');
        $('#third').removeClass('active');
    });
    $('.pay').click(function () {
        $('#first').removeClass('active');
        $('#second').addClass('active');
        $('#third').removeClass('active');
    });
    $('.wrap').click(function () {
        $('#first').removeClass('active');
        $('#second').removeClass('active');
        $('#third').addClass('active');
    });

