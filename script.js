$(document).ready(function () {



  var translateX = 0,
    translateY = 0,
    lastMousePosX = 0,
    lastMousePosY = 0,


    startSlideWidth = $("#slide").innerWidth(),
    slideWidth = $("#slide").innerWidth(),
    slideWidthStep = $("#slide").innerWidth() / 7,
    startSlideHeight = $("#slide").innerHeight(),
    slideHeight = $("#slide").innerHeight(),
    slideHeightStep = $("#slide").innerHeight() / 7,

    containerTop = $('#slideContainer').position().top,
    containerLeft = $('#slideContainer').position().left,


    phoneToucheOne = 0,
    phoneToucheTwo = 0,
    lastDistance = 0,



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
    $("#slide").css({ 'transform': 'translate(' + translateX + 'px, ' + translateY + 'px)', "min-width": slideWidth, 'width': slideWidth, "min-height": slideHeight, 'height': slideHeight });
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
    slideWidth = (slideWidth < (startSlideWidth * 5)) ? slideWidth + slideWidthStep : slideWidth;
    slideHeight = (slideHeight < (startSlideHeight * 5)) ? slideHeight + slideHeightStep : slideHeight;
    // $("#slideContainer").css({ 'min-width': containerWidth * (slideWidth / startSlideWidth) });
    let countContainerWidth = slideWidth;
    $("#slideContainer").css({ 'min-width': countContainerWidth, 'max-width': countContainerWidth, 'width': countContainerWidth });
    containerWidth = $("#slideContainer").innerWidth();
  }

  function onZoomOut() {
    slideWidth = (slideWidth > (startSlideWidth / 5)) ? slideWidth - slideWidthStep : slideWidth;
    slideHeight = (slideHeight > (startSlideHeight / 5)) ? slideHeight - slideHeightStep : slideHeight;
    // $("#slideContainer").css({ 'min-width': containerWidth * (slideWidth / startSlideWidth) });

    let countContainerWidth = slideWidth;
    $("#slideContainer").css({ 'min-width': countContainerWidth, 'max-width': countContainerWidth, 'width': countContainerWidth });
    containerWidth = $("#slideContainer").innerWidth();
  }

  function removePxStr(str) {
    const indexOfPx = str.indexOf('px');
    return +str.slice(0, indexOfPx);
  }

  function phonePositionCount() {
    const maxPosX = containerWidth - (containerPaddingLeft + slideWidth);
    // console.log(containerWidth, maxPosX, slide);
    translateX = (lastMousePosX <= -containerPaddingLeft) ? -containerPaddingLeft : (lastMousePosX >= maxPosX) ? maxPosX : lastMousePosX;
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
      lastMousePosX = initial_obj_X + (e.pageX - initial_mouse_X);
      lastMousePosY = initial_obj_Y + (e.pageY - initial_mouse_Y);
      const maxPosX = containerWidth - (containerPaddingLeft + slideWidth);
      translateX = (lastMousePosX <= -containerPaddingLeft) ? -containerPaddingLeft : (lastMousePosX >= maxPosX) ? maxPosX : lastMousePosX;
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
      onDragging(e, 'touchend')
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
        var dist = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        if (lastDist) {
          var delta = dist - lastDist;
          var scale = delta / 100;
          var img = document.querySelector("img");
          var width = img.offsetWidth;
          var height = img.offsetHeight;
          img.style.width = width + width * scale + "px";
          img.style.height = height + height * scale + "px";
        }
      lastDist = dist;
      return;
    } else {
      onDragging(e, 'touchmove', true);
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