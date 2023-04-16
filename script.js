$(document).ready(function () {
  var translateX = 0,
    translateY = 0,
    lastMousePosX = 0,
    lastMousePosY = 0,

    slidePaddingTop = removePxStr($('#slide').css("padding-top")),
    slidePaddingLeft = removePxStr($('#slide').css("padding-left")),
    slidePaddingBottom = removePxStr($('#slide').css("padding-bottom")),
    slidePaddingRight = removePxStr($('#slide').css("padding-right")),

    slideMarginTop = removePxStr($('#slide').css("margin-top")),
    slideMarginLeft = removePxStr($('#slide').css("margin-left")),
    slideMarginBottom = removePxStr($('#slide').css("margin-bottom")),
    slideMarginRight = removePxStr($('#slide').css("margin-right")),


    startSlideWidth = $("#slide").innerWidth(),
    slideWidth = startSlideWidth - (slidePaddingLeft + slidePaddingRight),
    slideWidthStep = $("#slide").innerWidth() / 7,
    startSlideHeight = $("#slide").innerHeight(),
    slideHeight = $("#slide").innerHeight(),
    slideHeightStep = $("#slide").innerHeight() / 7,

    containerTop = $('#slideContainer').position().top,

    containerPaddingTop = removePxStr($('#slideContainer').css("padding-top")),
    containerPaddingLeft = removePxStr($('#slideContainer').css("padding-left")),
    containerPaddingBottom = removePxStr($('#slideContainer').css("padding-bottom")),
    containerPaddingRight = removePxStr($('#slideContainer').css("padding-right")),


    containerWidth = $("#slideContainer").innerWidth(),

    initial_obj_X = 0,
    initial_obj_Y = 0,
    initial_mouse_X = 0,
    initial_mouse_Y = 0;

  function apply_coords() {
    $("#slide").css({ 'transform': 'translate(' + translateX + 'px, ' + translateY + 'px)', "min-width": slideWidth, 'width': slideWidth, 'min-height': slideHeight });
    getSlideMargins();
    // $("#slideContainer").css({ 'min-width': slideWidth, 'max-width': slideWidth, 'width': slideWidth });
    // containerWidth = $("#slideContainer").innerWidth();
  }

  function getSlideMargins() {
    slideMarginTop = removePxStr($('#slide').css("margin-top"));
    slideMarginLeft = removePxStr($('#slide').css("margin-left"));
    slideMarginBottom = removePxStr($('#slide').css("margin-bottom"));
    slideMarginRight = removePxStr($('#slide').css("margin-right"));
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
      if (zoomOut) {
        onZoomOut();
      } else {
        onZoomIn();
      }
      apply_coords();
    }
  });

  function onZoomIn() {
    slideWidth = (slideWidth < (startSlideWidth * 5)) ? slideWidth + slideWidthStep : slideWidth;
    slideHeight = (slideHeight < (startSlideHeight * 5)) ? slideHeight + slideHeightStep : slideHeight;
    // const newContainerWidth = containerWidth * (slideWidth / startSlideWidth);
    // const newContainerHeight = containerWidth * (slideWidth / startSlideWidth);

    // $("#slideContainer").css({ 'min-width': newContainerWidth, 'max-width': newContainerWidth, 'width': newContainerWidth });
    containerWidth = $("#slideContainer").innerWidth();
  }

  function onZoomOut() {
    slideWidth = (slideWidth > (startSlideWidth / 5)) ? slideWidth - slideWidthStep : slideWidth;
    slideHeight = (slideHeight > (startSlideHeight / 5)) ? slideHeight - slideHeightStep : slideHeight;
    // const newContainerWidth = containerWidth * (slideWidth / startSlideWidth);
    // const newContainerHeight = containerWidth * (slideWidth / startSlideWidth);

    // $("#slideContainer").css({ 'min-width': newContainerWidth, 'max-width': newContainerWidth, 'width': newContainerWidth });
    containerWidth = $("#slideContainer").innerWidth();
  }

  function removePxStr(str) {
    const indexOfPx = str.indexOf('px');
    return +str.slice(0, indexOfPx);
  }

  function phonePositionCount() {
    const maxPosX = containerPaddingRight + slideMarginRight;
    translateX = (lastMousePosX <= -(containerPaddingLeft + slideMarginLeft)) ? -(containerPaddingLeft + slideMarginLeft) : (lastMousePosX >= maxPosX) ? maxPosX : lastMousePosX;
    const maxPosY = containerPaddingBottom + slideMarginBottom;
    translateY = (lastMousePosY <= -containerPaddingTop) ? -containerPaddingTop : (lastMousePosY >= maxPosY) ? maxPosY : lastMousePosY;
    apply_coords();
  }


  function onDragging(e, is_phone = false) {
    if (is_phone) {
      if (is_dragging) {
        e.preventDefault();
        lastMousePosX =
          (slideWidth / startSlideWidth >= 0.43)
            ? e.changedTouches[0].pageX - ((slideWidth) + ((screen.width - containerWidth) / 2) + containerPaddingLeft)
            : e.changedTouches[0].pageX - ((slideWidth * 2) + ((screen.width - containerWidth) / 2) + containerPaddingLeft);
        lastMousePosY = e.changedTouches[0].pageY - ((slideHeight / 2) + containerPaddingTop + containerTop);
        phonePositionCount();
      }
      return
    }
    if (is_dragging) {
      e.preventDefault();
      lastMousePosX = initial_obj_X + (e.pageX - initial_mouse_X);
      lastMousePosY = initial_obj_Y + (e.pageY - initial_mouse_Y);
      const maxPosX = containerWidth - (containerPaddingLeft + slideWidth);
      translateX = (lastMousePosX <= -(containerPaddingLeft + slideMarginLeft)) ? -(containerPaddingLeft + slideMarginLeft) : (lastMousePosX >= maxPosX) ? maxPosX : lastMousePosX;
      translateY = (lastMousePosY <= -containerPaddingTop) ? -containerPaddingTop : (lastMousePosY >= containerPaddingBottom) ? containerPaddingBottom : lastMousePosY;
      apply_coords();
    } else {
      initial_mouse_X = e.pageX;
      initial_mouse_Y = e.pageY;
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
      onDragging(e)
    })
    .mouseup(function () {
      is_dragging = false;
    });

  $('#zoom-in').on("click", () => {
    onZoomIn();
    phonePositionCount();
  })

  $('#zoom-out').on("click", () => {
    onZoomOut();
    phonePositionCount();
  })

  var lastDist = null;

  $("#slideContainer").on('touchmove', e => {
    if (e.touches.length == 2) {
      var touch1 = e.touches[0];
      var touch2 = e.touches[1];
      var dist = Math.sqrt((touch2.pageX - touch1.pageX) * (touch2.pageX - touch1.pageX) + (touch2.pageY - touch1.pageY) * (touch2.pageY - touch1.pageY));
      if (lastDist) {
        let delta = dist - lastDist;
        let scale = delta / 10;
        if (scale > 0.8) {
          onZoomIn();
          apply_coords();
        } else if (scale < -0.7) {
          onZoomOut();
          apply_coords();
        }
      }
      lastDist = dist;
      return;
    } else {
      onDragging(e, true);
    }
  })

  $(window).on('touchmove', e => {
    if (e.touches.length == 2) {
      e.preventDefault();
    }
  })


  $("#slideContainer").on('touchstart', e => {
    is_dragging = true;
  })

  $("#slideContainer").on('touchend', e => {
    is_dragging = false;
    lastDist = null;
  })

});