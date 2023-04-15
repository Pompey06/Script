$(document).ready(function () {

  var translateX = 0,
    translateY = 0,
    // translateZ = 0,
    // stepZ = 20,


    // scaleCount = 1,
    // stepScale = 0.2,

    lastMousePosX = 0,
    lastMousePosY = 0,


    startSlideWidth = $("#slide").innerWidth(),
    slideWidth = $("#slide").innerWidth(),
    slideWidthStep = $("#slide").innerWidth() / 10,
    startSlideHeight = $("#slide").innerHeight(),
    slideHeight = $("#slide").innerHeight(),
    slideHeightStep = $("#slide").innerHeight() / 10,

    containerTop = $('#slideContainer').position().top,
    containerLeft = $('#slideContainer').position().left,



    containerPaddingTop = removePxStr($('#slideContainer').css("padding-top")),
    containerPaddingLeft = removePxStr($('#slideContainer').css("padding-left")),
    containerPaddingBottom = removePxStr($('#slideContainer').css("padding-bottom")),
    containerPaddingRight = removePxStr($('#slideContainer').css("padding-right")),


    containerWidth = $("#slideContainer").innerWidth(),
    containerHeight = $("#slideContainer").innerWidth(),



    initial_obj_X = 0,
    initial_obj_Y = 0,
    initial_mouse_X = 0,
    initial_mouse_Y = 0;

  function apply_coords() {
    // $("#slide").css("transform", 'perspective(100px) translate3d(' + translateX + 'px, ' + translateY + 'px, ' + translateZ + 'px)');
    // $("#slide").css("transform", 'perspective(100px) translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleCount + ')');



    // $("#slide").css("transform", 'perspective(100px) translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleCount + ')');



    $("#slide").css({ 'transform': 'translate(' + translateX + 'px, ' + translateY + 'px)', "width": slideWidth, "min-height": slideHeight });
  }


  $("#slide").on("mousewheel DOMMouseScroll", function (e) {
    if (e.ctrlKey) {
      e.preventDefault();
      var delta = e.delta || e.originalEvent.wheelDelta;
      var zoomOut;
      if (delta === undefined) {
        delta = e.originalEvent.detail;
        zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        zoomOut = !zoomOut;
      } else {
        zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      }
      // if (zoomOut) {
      // 	translateZ = translateZ - stepZ;
      // } else {
      // 	translateZ = translateZ + stepZ;
      // }

      if (zoomOut) {
        onZoomOut();
        // scaleCount = (scaleCount > 0.5) ? scaleCount - stepScale : scaleCount;
      } else {
        // scaleCount = (scaleCount < 3) ? scaleCount + stepScale : scaleCount;
        onZoomIn();
      }
      apply_coords();
    }
  });

  function onZoomIn() {
    slideWidth = (slideWidth < (startSlideWidth * 3)) ? slideWidth + slideWidthStep : slideWidth;
    slideHeight = (slideHeight < (startSlideHeight * 3)) ? slideHeight + slideHeightStep : slideHeight;
  }

  function onZoomOut() {
    slideWidth = (slideWidth > (startSlideWidth / 3)) ? slideWidth - slideWidthStep : slideWidth;
    slideHeight = (slideHeight > (startSlideHeight / 3)) ? slideHeight - slideHeightStep : slideHeight;
  }

  function removePxStr(str) {
    const indexOfPx = str.indexOf('px');
    return +str.slice(0, indexOfPx);
  }

  function phonePositionCount() {
    const maxPosX = containerWidth - (containerPaddingLeft + slideWidth);
    translateX = (lastMousePosX <= -containerPaddingLeft) ? -containerPaddingLeft : (lastMousePosX >= maxPosX) ? maxPosX : lastMousePosX;
    apply_coords();
    const maxPosY = containerPaddingBottom;
    translateY = (lastMousePosY <= -containerPaddingTop) ? -containerPaddingTop : (lastMousePosY >= maxPosY) ? maxPosY : lastMousePosY;
    apply_coords();
  }


  function onDragging(e, type, is_phone = false) {
    if (is_phone) {
      if (is_dragging) {
        e.preventDefault();
        lastMousePosX = e.changedTouches[0].pageX - (slideWidth / 2);
        lastMousePosY = e.changedTouches[0].pageY - ((slideHeight / 2) + containerPaddingTop + containerTop);
        phonePositionCount();
      }
      return
    }
    if (is_dragging) {
      e.preventDefault();
      var currentX = e.type === type ? e.changedTouches[0].pageX : e.pageX;
      var currentY = e.type === type ? e.changedTouches[0].pageY : e.pageY;
      translateX = initial_obj_X + (currentX - initial_mouse_X);
      translateY = initial_obj_Y + (currentY - initial_mouse_Y);
      apply_coords();
    } else {
      initial_mouse_X = e.type === type ? e.changedTouches[0].pageX : e.pageX;
      initial_mouse_Y = e.type === type ? e.changedTouches[0].pageY : e.pageY;
      initial_obj_X = translateX;
      initial_obj_Y = translateY;
    }
  }


  var is_dragging = false;
  $("#slideContainer")
    .mousedown(function (e) {
      is_dragging = true;
    })
    .mousemove(function (e) {
      onDragging(e, 'touchend')
    })
    .mouseup(function () {
      is_dragging = false;
    });

  $('#zoom-in').on("click", () => {
    // scaleCount = (scaleCount < 3) ? scaleCount + stepScale : scaleCount;

    onZoomIn();
    // apply_coords();
    phonePositionCount();
  })

  $('#zoom-out').on("click", () => {
    // scaleCount = (scaleCount > 0.5) ? scaleCount - stepScale : scaleCount;

    onZoomOut();
    phonePositionCount();
    // apply_coords();
  })

  $("#slideContainer").on('touchstart', e => {
    is_dragging = true;
  })

  $("#slideContainer").on('touchend', e => {
    is_dragging = false;
  })

  $("#slideContainer").on('touchmove', e => {
    onDragging(e, 'touchmove', true)
  })
  // $(window).on('touchstart', e => {
  //   is_dragging = true;
  // })

  // $(window).on('touchend', e => {
  //   is_dragging = false;
  // })

  // $(window).on('touchmove', e => {
  //   onDragging(e, 'touchmove', true)
  // })
});