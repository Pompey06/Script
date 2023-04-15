$(document).ready(function () {

  var translateX = 0,
    translateY = 0,
    // translateZ = 0,
    scaleCount = 1,
    // stepZ = 20,
    stepScale = 0.2,
    initial_obj_X = 0,
    initial_obj_Y = 0,
    initial_mouse_X = 0,
    initial_mouse_Y = 0;

  function apply_coords() {
    // $("#slide").css("transform", 'perspective(100px) translate3d(' + translateX + 'px, ' + translateY + 'px, ' + translateZ + 'px)');
    $("#slide").css("transform", 'perspective(100px) translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleCount + ')');
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
        scaleCount = (scaleCount > 0.5) ? scaleCount - stepScale : scaleCount;
      } else {
        scaleCount = (scaleCount < 3) ? scaleCount + stepScale : scaleCount;
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
    scaleCount = (scaleCount < 3) ? scaleCount + stepScale : scaleCount;
    apply_coords();
  })

  $('#zoom-out').on("click", () => {
    scaleCount = (scaleCount > 0.5) ? scaleCount - stepScale : scaleCount;
    apply_coords();
  })

  $("#slide").on('touchstart', e => {
    console.log('start')
  })

  $("#slide").on('touchend', e => {
    console.log('end')
  })

  $("#slide").on('touchmove', e => {
    console.log('move')
  })
});