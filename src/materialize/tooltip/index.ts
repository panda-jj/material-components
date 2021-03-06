var Velocity = require('velocity-animate');

function getOffset(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
}

// todo swap tooltip if oversize window
export default function (element, message, position = 'top', delay = 50, cssClass = '') {
    var timeout = null,
        margin = 10;

    var origin = element;
    if (!element._tooltip) {
        // Create Text span
        var tooltip_text = document.createElement("SPAN");
        tooltip_text.textContent = message;

        // Create tooltip
        var newTooltip = document.createElement("DIV");
        newTooltip.classList.add('material-tooltip');
        if (cssClass) newTooltip.classList.add(cssClass);
        newTooltip.appendChild(tooltip_text);
        document.body.appendChild(newTooltip);
        var newBackdrop = document.createElement("DIV");
        newBackdrop.classList.add('backdrop');
        newTooltip.appendChild(newBackdrop);
        newBackdrop.style.top = '0';
        newBackdrop.style.left = '0';

        document.body.appendChild(newTooltip);

        element._tooltip = newTooltip;
        element._backdrop = newBackdrop;
    }

    var tooltip = element._tooltip;
    var backdrop = element._backdrop;
    var started;
    var timeoutRef = setTimeout(function(){
        started = true;
        Velocity(tooltip, 'stop');
        Velocity(backdrop, 'stop');
        tooltip.style.display = 'block';
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';

        // Set Tooltip text
        // tooltip.children('span').text(origin.attr('data-tooltip'));

        // Tooltip positioning
        var originWidth = origin.offsetWidth;
        var originHeight = origin.offsetHeight;
        var tooltipPosition = position;
        var tooltipHeight = tooltip.offsetHeight;
        var tooltipWidth = tooltip.offsetWidth;
        var tooltipVerticalMovement = '0px';
        var tooltipHorizontalMovement = '0px';
        var scale_factor = 8;
        var targetTop, targetLeft, newCoordinates;

        if (tooltipPosition === "top") {
            // Top Position
            var pos = getOffset(element);
            targetTop = pos.top - tooltipHeight - margin;
            targetLeft = pos.left + originWidth/2 - tooltipWidth/2;
            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

            tooltipVerticalMovement = '-10px';
            backdrop.style.borderRadius = '14px 14px 0 0';
            backdrop.style.transformOrigin = '50% 90%';
            backdrop.style.marginTop = tooltipHeight.toString() + 'px';
            backdrop.style.marginLeft = ((tooltipWidth/2) - (backdrop.offsetWidth/2)).toString() + 'px';
        }
        // Left Position
        else if (tooltipPosition === "left") {
            var pos = getOffset(element);
            targetTop = pos.top + originHeight/2 - tooltipHeight/2;
            targetLeft =  pos.left - tooltipWidth - margin;
            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

            tooltipHorizontalMovement = '-10px';

            backdrop.style.width = '14px';
            backdrop.style.height = '14px';
            backdrop.style.borderRadius = '14px 0 0 14px';
            backdrop.style.transformOrigin = '95% 50%';
            backdrop.style.marginTop = (tooltipHeight/2).toString() + 'px';
            backdrop.style.marginLeft = tooltipWidth.toString() + 'px';
        }
        // Right Position
        else if (tooltipPosition === "right") {
            var pos = getOffset(element);
            targetTop = pos.top + originHeight/2 - tooltipHeight/2;
            targetLeft = pos.left + originWidth + margin;
               newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);

            tooltipHorizontalMovement = '+10px';
            backdrop.style.width = '14px';
            backdrop.style.height = '14px';
            backdrop.style.borderRadius = '0 14px 14px 0';
            backdrop.style.transformOrigin = '5% 50%';
            backdrop.style.marginTop = (tooltipHeight/2).toString() + 'px';
            backdrop.style.marginLeft = '0px';
        }
        else {
            // Bottom Position
            var pos = getOffset(element);
            targetTop = pos.top + origin.offsetHeight + margin;
            targetLeft = pos.left + originWidth/2 - tooltipWidth/2;
            newCoordinates = repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);
            tooltipVerticalMovement = '+10px';
            backdrop.style.marginLeft = ((tooltipWidth/2) - (backdrop.offsetWidth/2)).toString() + 'px'
        }

        // Set tooptip css placement
        tooltip.style.top = newCoordinates.y + 'px';
        tooltip.style.left = newCoordinates.x + 'px';

        // Calculate Scale to fill
        scale_factor = tooltipWidth / 8;
        if (scale_factor < 8) {
            scale_factor = 8;
        }
        if (tooltipPosition === "right" || tooltipPosition === "left") {
            scale_factor = tooltipWidth / 10;
            if (scale_factor < 6)
                scale_factor = 6;
        }

        Velocity(tooltip, {marginTop: tooltipVerticalMovement, marginLeft: tooltipHorizontalMovement}, {duration: 350, queue: false});
        Velocity(tooltip, {opacity: 1}, {duration: 300, delay: 50, queue: false});
        backdrop.style.display = 'block';
        Velocity(backdrop, {opacity:1}, {duration: 55, delay: 0, queue: false});
        Velocity(backdrop, {scale: scale_factor}, {duration: 300, delay: 0, queue: false, easing: 'easeInOutQuad'});
    }, delay);

    element.addEventListener("click", function () {
        started = false;
        clearTimeout(timeoutRef);
        // Animate back
        setTimeout(function () {
            if (started != true) {
                Velocity(tooltip, { opacity: 0, marginTop: 0, marginLeft: 0 }, { duration: 225, queue: false });
                Velocity(backdrop, { opacity: 0, scale: 1 }, {
                    duration: 225,
                    queue: false,
                    complete: function () {
                        backdrop.style.display = 'none';
                        tooltip.style.display = 'none';
                        started = false;
                    }
                });
            }
        }, 225);
    })
    // todo obecne
    element.addEventListener("mouseleave", function () {
        started = false;
        clearTimeout(timeoutRef);

        // Animate back
        setTimeout(function() {
            if (started != true) {
                Velocity(tooltip, {opacity: 0, marginTop: 0, marginLeft: 0}, { duration: 225, queue: false});
                Velocity(backdrop, {opacity: 0, scale: 1}, {
                    duration: 225,
                    queue: false,
                    complete: function() {
                        backdrop.style.display = 'none';
                        tooltip.style.display = 'none';
                        started = false;
                    }
                });
            }
        }, 225);
    });
};

var repositionWithinScreen = function(x, y, width, height) {
    var newX = x;
    var newY = y;

    if (newX < 0) {
        newX = 4;
    } else if (newX + width > window.innerWidth + window.scrollX) {
        newX = window.document.documentElement.offsetWidth - width;
    }

    if (newY < 0) {
        newY = 4;
    } else if (newY + height > window.innerHeight + window.scrollY) {
        newY = window.document.documentElement.offsetHeight - height;
    }

    return {x: newX, y: newY};
};

