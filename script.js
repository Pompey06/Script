$(document).ready(function () {

  var translateX = 0,
    translateY = 0,
    translateZ = 0,
    stepZ = 20,
    initial_obj_X = 0,
    initial_obj_Y = 0,
    initial_mouse_X = 0,
    initial_mouse_Y = 0,


    slideHeight = $("#slide").innerHeight(),
    containerHeight = $("#slideContainer").innerHeight(),
    ratioContainerToSlideH = containerHeight / slideHeight;



  function apply_coords() {
    $("#slide").css("transform", 'perspective(100px) translate3d(' + translateX + 'px, ' + translateY + 'px, ' + translateZ + 'px)');
    slideHeight = $("#slide").innerHeight();
    containerHeight = slideHeight * ((1 + (translateZ / 100))) * ratioContainerToSlideH;
    $('#slideContainer').css("height", containerHeight + 'px');
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
        translateZ = (translateZ > -60) ? translateZ - stepZ : translateZ;
      } else {
        translateZ = (translateZ < 60) ? translateZ + stepZ : translateZ;
      }
      apply_coords();
    }
  });


  var is_dragging = false;
  $("#slideContainer")
    .mousedown(function (e) {
      is_dragging = true;
    })
    .mousemove(function (e) {
      if (is_dragging) {
        e.preventDefault();
        var currentX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
        var currentY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
        translateX = initial_obj_X + (currentX - initial_mouse_X);
        translateY = initial_obj_Y + (currentY - initial_mouse_Y);
        apply_coords();
      } else {
        initial_mouse_X = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
        initial_mouse_Y = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
        initial_obj_X = translateX;
        initial_obj_Y = translateY;
      }
    })
    .mouseup(function () {
      is_dragging = false;
    });


  $('#zoom-in').on("click", () => {
    translateZ = (translateZ < 80) ? translateZ + stepZ : translateZ;
    apply_coords();
  })

  $('#zoom-out').on("click", () => {
    translateZ = (translateZ > -80) ? translateZ - stepZ : translateZ;
    apply_coords();
  })

  $(window).on('touchmove', e => {
    if (e.touches.length == 2) {
      e.preventDefault();
    }
  })

  function removePxStr(str) {
    const indexOfPx = str.indexOf('px');
    return +str.slice(0, indexOfPx);
  }



  $("#slideContainer").on('touchstart', e => {
    is_dragging = true;
    initial_mouse_X = e.changedTouches[0].pageX;
    initial_mouse_Y = e.changedTouches[0].pageY;
    initial_obj_X = translateX;
    initial_obj_Y = translateY;
  })

  $("#slideContainer").on('touchmove', e => {
    if (e.touches.length == 2) {
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
        translateZ = (translateZ > -60) ? translateZ - stepZ : translateZ;
      } else {
        translateZ = (translateZ < 60) ? translateZ + stepZ : translateZ;
      }
      apply_coords();
      return;
    }
    if (is_dragging) {
      e.preventDefault();
      var currentX = e.changedTouches[0].pageX;
      var currentY = e.changedTouches[0].pageY;
      translateX = initial_obj_X + (currentX - initial_mouse_X);
      translateY = initial_obj_Y + (currentY - initial_mouse_Y);
      apply_coords();
    } else {
      initial_mouse_X = e.changedTouches[0].pageX;
      initial_mouse_Y = e.changedTouches[0].pageY;
      initial_obj_X = translateX;
      initial_obj_Y = translateY;
    }
  })
  $("#slideContainer").on('touchend', e => {
    is_dragging = false;
    initial_mouse_X = e.changedTouches[0].pageX;
    initial_mouse_Y = e.changedTouches[0].pageY;
    initial_obj_X = translateX;
    initial_obj_Y = translateY;
  })
});