$(document).ready(function () {

  var translateX = 0,
    translateY = 0,
    // translateZ = 0,
    // stepZ = 20,


    // scaleCount = 1,
    // stepScale = 0.2,


    startSlideWidth = $("#slide").innerWidth(),
    slideWidth = $("#slide").innerWidth(),
    slideWidthStep = $("#slide").innerWidth() / 10,
    startSlideHeight = $("#slide").innerHeight(),
    slideHeight = $("#slide").innerHeight(),
    slideHeightStep = $("#slide").innerHeight() / 10,



    initial_obj_X = 0,
    initial_obj_Y = 0,
    initial_mouse_X = 0,
    initial_mouse_Y = 0;

  function apply_coords() {
    // $("#slide").css("transform", 'perspective(100px) translate3d(' + translateX + 'px, ' + translateY + 'px, ' + translateZ + 'px)');
    // $("#slide").css("transform", 'perspective(100px) translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleCount + ')');



    // $("#slide").css("transform", 'perspective(100px) translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleCount + ')');



    $("#slide").css({ 'transform': 'translate(' + translateX + 'px, ' + translateY + 'px)', "width": slideWidth, "min-height": slideHeight  });
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


  function onDragging(e, type) {
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
    apply_coords();
  })

  $('#zoom-out').on("click", () => {
    // scaleCount = (scaleCount > 0.5) ? scaleCount - stepScale : scaleCount;

    onZoomOut();
    apply_coords();
  })

  $("#slideContainer").on('touchstart', e => {
    is_dragging = true;
  })

  $("#slideContainer").on('touchend', e => {
    is_dragging = false;
  })

  $("#slideContainer").on('touchmove', e => {
    onDragging(e, 'touchmove')
  })
});