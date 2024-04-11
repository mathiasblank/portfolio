/*******************************************************************

    Tools / Scroll bar width

    Version: 1.0.0
    Created @: 08.10.2021
    Source: https://stackoverflow.com/questions/8079187/how-to-calculate-the-width-of-the-scroll-bar

*****************************************************************/

define('scroll_bar_width', function() {

    // - Create elements to calculate the client browser scroll bar width.
    function getScrollBarWidth () { 

        var inner = document.createElement('p'); 
        inner.style.width = "100%"; 
        inner.style.height = "200px"; 
        
        var outer = document.createElement('div'); 
        outer.style.position = "absolute"; 
        outer.style.top = "0px"; 
        outer.style.left = "0px"; 
        outer.style.visibility = "hidden"; 
        outer.style.width = "200px"; 
        outer.style.height = "150px"; 
        outer.style.overflow = "hidden"; 
        outer.appendChild (inner); 
        
        document.body.appendChild (outer); 
        var w1 = inner.offsetWidth; 
        outer.style.overflow = 'scroll'; 
        var w2 = inner.offsetWidth; 
        if (w1 == w2) w2 = outer.clientWidth; 
        
        document.body.removeChild (outer); 

        console.log(w1, w2, w1 - w2);
        
        return w1 - w2; 

    }

    return {

        width : function() {

            return getScrollBarWidth();

        }

    };

});