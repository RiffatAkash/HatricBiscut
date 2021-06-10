
jQuery(function($) {
  $( document ).ready(function() {


    function preventBehavior(e) {
      e.preventDefault();
    };
    //document.addEventListener("touchmove", preventBehavior, {passive: false});


    let canClick = true;
    let notWin = true;
    let array = [[3,2,1],[1,2,1],[3,3,2]];
    let currRowIndex, currCellIndex;
    let newRowIndex, newCellIndex;
    let canTrackMove = false;
    let rowId, idCell;
    let thisCellValue, thisCell;
    let currMove, reverseMove;
    let road;
    let maxRoad = $('.game_field').height()/3;
    let newCellValue, newCell;

    let startPointX, startPointY, endPointX, endPointY;
    let cantMoveX, cantMoveY;

    function hideCursorBlock() {
      // setTimeout(function() {
      //   $('.cursorBlock').addClass('hidden');
      // }, 500);
      $('.section1').addClass("stopAnim");
    };
    $('.section1.active').on('mouseover touchstart', function(e){
      hideCursorBlock();
    });

    /* generate content */
    for(var i=1; i<=array.length;i++){
      $('.game_field').append('<div data-row-id='+i+' class="row"></div>');
      $('.row').each((y, el) => {
        if ($(el).data('rowId') === i){
          for(var k=1; k<=array[0].length;k++){
            $(el).append('<div data-row-id='+i+' data-id-cell='+k+' data-number='+array[i-1][k-1]+' class="cell">'+array[i-1][k-1]+'</div>');
          }
        }
      })
    }

    $(".cell").on("mousedown touchstart", function(e) {
      document.addEventListener("touchstart", preventBehavior, {passive: false});
      dragft();

      if (notWin && canClick) {
        canClick = false;
        thisCell = null;
        newCell  = null;
        startPointX = e.clientX || e.touches[0].clientX;
        startPointY = e.clientY || e.touches[0].clientY;

        $(this).addClass('selected');

        cantMoveX = " ";
        cantMoveY = " ";

        // if (canClick) {
        currRowIndex = parseInt(this.getAttribute('data-row-id'));
        currCellIndex = parseInt(this.getAttribute('data-id-cell'));

        if (currRowIndex == 1) {
          cantMoveY = 'cantUp';
        } else if (currRowIndex == 3) {
          cantMoveY = 'cantDown';
        }

        if (currCellIndex == 1) {
          cantMoveX = 'cantLeft';
        } else if (currCellIndex == 3) {
          cantMoveX = 'cantRight';
        }

        thisCell = this;
        thisCellValue = $(this).text();

        findPlace();
        // }
      }
    });

    function findPlace() {
      canTrackMove = true;
      currMove = '';
      reverseMove = '';

      $('.game_field').on("mousemove touchmove", function(e){
        if (canTrackMove && notWin) {
          endPointX = e.clientX || e.touches[0].clientX;
          endPointY = e.clientY || e.touches[0].clientY;
          let differenceX = endPointX - startPointX;
          let differenceY = endPointY - startPointY;

          // vertical
          if ((differenceY >= (-maxRoad/2)) && (differenceY <= (maxRoad/2))) {
            // to Up
            if (startPointY > endPointY && (differenceX >= (-maxRoad/4)) && (differenceX <= (maxRoad/4))) {
              currMove = 'moveToUp';
              reverseMove = 'moveToDown';
            }
            // to Down
            if (startPointY < endPointY && (differenceX >= (-maxRoad/4)) && (differenceX <= (maxRoad/4))) {
              currMove = 'moveToDown';
              reverseMove = 'moveToUp';
            }
          }

          // horizontal
          if ((differenceX >= (-maxRoad/2)) && (differenceX <= (maxRoad/2))) {
            // to Up
            if (startPointX > endPointX && (differenceY >= (-maxRoad/4)) && (differenceY <= (maxRoad/4))) {
              currMove = 'moveToLeft';
              reverseMove = 'moveToRight';
            }
            // to Down
            if (startPointX < endPointX && (differenceY >= (-maxRoad/4)) && (differenceY <= (maxRoad/4))) {
              currMove = 'moveToRight';
              reverseMove = 'moveToLeft';
            }
          }

          // calcRoad
          function calcRoad() {
            if (road >= maxRoad) {
              road = maxRoad;
            } else if (road < 0) {
              road = 0;
            }
            /* check cant */
            if ((cantMoveY == 'cantUp' && currMove == 'moveToUp') || (cantMoveY == 'cantDown' && currMove == 'moveToDown') || (cantMoveX == 'cantLeft' && currMove == 'moveToLeft') || (cantMoveX== 'cantRight' && currMove == 'moveToRight')) {
              road = 0;
            }
          }


          // moveToUp
          if (currMove == 'moveToUp') {
            if (endPointY < startPointY) {
              road = startPointY - endPointY;
              calcRoad();
              $(thisCell).css({'transform' : 'translate(0px, ' + (-road) +'px)'});
            }
          }

          // moveToDown
          if (currMove == 'moveToDown') {
            if (endPointY > startPointY) {
              road = endPointY - startPointY;
              calcRoad();
              $(thisCell).css({'transform' : 'translate(0px, ' + road +'px)'});
            }
          }

          // moveToLeft
          if (currMove == 'moveToLeft') {
            if (endPointX < startPointX) {
              road = startPointX - endPointX;
              calcRoad();
              $(thisCell).css({'transform' : 'translate(' + (-road) +'px, 0px)'});
            }
          }

          // moveToRight
          if (currMove == 'moveToRight') {
            if (endPointX > startPointX) {
              road = endPointX - startPointX;
              calcRoad();
              $(thisCell).css({'transform' : 'translate(' + road +'px, 0px)'});
            }
          }

        }
      });

      $('.game_field').on("mouseup touchend", function(){
        checkWay();
      });

      $('.game_field').on("mouseleave", function(){
        checkWay();
      });
    }

    function checkWay() {
      if (canTrackMove) {
        canTrackMove = false;
        if (thisCell) {
          $(thisCell).css({'transform' : ''});
          if (road >= (maxRoad/2)) {
            endThisMove();
          } else if (road < (maxRoad/2)) {
            backThisCell();
          }else if(typeof road === 'undefined' ){
            endThisMove();
          }

        }
        $(".cell").removeClass('selected');
      }
      document.removeEventListener("touchstart", preventBehavior);
    }

    function backThisCell() {
      $(thisCell).addClass('addTrans');
      $(thisCell).addClass('moveThis');
      $(thisCell).css({'transform' : 'translate(0px, 0px)'});
      setTimeout(()=>{
        $(thisCell).removeClass('addTrans');
        $(thisCell).removeClass('moveThis');
        canClick = true;
        canTrackMove = false;
      }, 250);
    }

    function findNewCell() {
      newRowIndex = 0;
      newCellIndex = 0;
      // moveToUp
      if (currMove == 'moveToUp') {
        newRowIndex = currRowIndex - 1;
        newCellIndex = currCellIndex;
      }

      // moveToDown
      if (currMove == 'moveToDown') {
        newRowIndex = currRowIndex + 1;
        newCellIndex = currCellIndex;
      }

      // moveToLeft
      if (currMove == 'moveToLeft') {
        newRowIndex = currRowIndex;
        newCellIndex = currCellIndex - 1;
      }

      // moveToRight
      if (currMove == 'moveToRight') {
        newRowIndex = currRowIndex;
        newCellIndex = currCellIndex + 1;
      }

      let tmpNewCell = '.cell[data-row-id="' + newRowIndex + '"][data-id-cell="' + newCellIndex + '"]';
      newCell = $(tmpNewCell);
      newCellValue = $(newCell).text();

      console.log(newCellValue);
    }

    function endThisMove() {
      if (notWin && thisCell != null && thisCellValue != '') {
        $(thisCell).addClass('addTrans');
        $(thisCell).addClass('moveThis');
        $(thisCell).addClass(currMove);
        findNewCell();
        $(newCell).addClass('addTrans');
        $(newCell).addClass('moveThis');
        $(newCell).addClass(reverseMove);
        setTimeout(()=>{

          if(newCellValue == ''){
            $(thisCell).text(thisCellValue);
            $(thisCell).attr('data-number', thisCellValue);
          }else{
            $(thisCell).text(newCellValue);
            $(thisCell).attr('data-number', newCellValue);
          }

          $(newCell).text(thisCellValue);
          $(newCell).attr('data-number', thisCellValue);

          $(thisCell).removeClass('addTrans');
          $(thisCell).removeClass('moveThis');
          $(thisCell).removeClass(currMove);
          $(newCell).removeClass('addTrans');
          $(newCell).removeClass('moveThis');
          $(newCell).removeClass(reverseMove);


          generateArray();
        }, 250);
      }
    }


    function generateArray() {
      let cykl = 0;
      $('.row').each((y, el) => {
        let arrInd = y;
        array[arrInd] = [];
        $(el).find('.cell').each((n, elAr) =>{
          array[arrInd].push(parseInt($(elAr).text()));
          cykl++;
          if (cykl == 9) {
            checkArray();
          }
        });
      });
    }

    function checkArray(){
      canClick = true;
      canTrackMove = false;
      if ((array[0][0] == 3) && (array[0][1] == 3) && (array[0][2] == 3)) {
        $('.section1').addClass('horiz1');
        finishScreen();
      } else if ((array[1][0] == 3) && (array[1][1] == 3) && (array[1][2] == 3)) {
        $('.section1').addClass('horiz2');
        finishScreen();
      } else if ((array[2][0] == 3) && (array[2][1] == 3) && (array[2][2] == 3)) {
        $('.section1').addClass('horiz3');
        finishScreen();
      } else if ((array[0][0] == 3) && (array[1][0] == 3) && (array[2][0] == 3)) {
        $('.section1').addClass('vert1');
        finishScreen();
      } else if ((array[0][1] == 3) && (array[1][1] == 3) && (array[2][1] == 3)) {
        $('.section1').addClass('vert2');
        finishScreen();
      } else if ((array[0][2] == 3) && (array[1][2] == 3) && (array[2][2] == 3)) {
        $('.section1').addClass('vert3');
        finishScreen();
      } else if ((array[0][0] == 3) && (array[1][1] == 3) && (array[2][2] == 3)) {
        $('.section1').addClass('diag1');
        finishScreen();
      } else if ((array[0][2] == 3) && (array[1][1] == 3) && (array[2][0] == 3)) {
        $('.section1').addClass('diag2');
        finishScreen();
      }

      function finishScreen() {
        notWin = false;
        dragft2();
        setTimeout(()=>{
          $('.section1').addClass('win');
        }, 50);
        setTimeout(()=>{
          $('p').text('YOU WIN');
          $('p').addClass('white');
        }, 300);
        setTimeout(()=>{
          $('.active').removeClass('active');
          $('.final').addClass('active');
        }, 2000);
      }
    }

  });
});
