var target = document.querySelector('#target');

var defaultString = target.firstChild.innerHTML;
var MAX_FORCE = 3;

var addLog = function (text) {
    var eventLogger = document.querySelector('#logger');
    var value = eventLogger.value;
    var scrollTop = eventLogger.scrollTop;

    eventLogger.value = value + text + '\n';
    eventLogger.scrollTop = scrollTop + 99;
};

var prepare = function (event) {
    addLog('webkitmouseforcewillbegin');

    // Avoid the native context menu of Safari…
    event.preventDefault();
};

var end = function () {
    addLog('mouseup');

    target.style.backgroundColor = '';
    target.firstChild.innerHTML = defaultString;

    rotate(1);
};

var change = function (event) {
    var force = event.webkitForce;
    var opacity = 0;

    if (force === 0) {
        return;
    }

    addLog('webkitmouseforcechanged: ' + force);

    if (force > MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN) {
        opacity = force / MAX_FORCE;
        target.style.backgroundColor = 'rgba(191, 255, 0, ' + opacity + ')';

        target.firstChild.innerHTML = 'Yep, that will be a force click if you let go now! <br /> Force: ' + force;
    } else if (force > MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN) {
        opacity = force / MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
        target.style.backgroundColor = 'rgba(255, 127, 0, ' + opacity + ')';

        target.firstChild.innerHTML = 'Unit now, this will be recognized as a normal click… <br /> Force: ' + force;
    }

    rotate(force);
};

var rotate = function (force) {
    var icon = document.querySelector('#icon');
    var degree = (force - 1) / MAX_FORCE * 360;

    icon.style.transform = 'rotate(' + degree + 'deg)';
};

// Standard events
target.addEventListener('mousedown', addLog.bind(this, 'mousedown'), false);
target.addEventListener('mouseup', end, false);
target.addEventListener('click', addLog.bind(this, 'click'), false);

// Force click events
target.addEventListener('webkitmouseforcedown', addLog.bind(this, 'webkitmouseforcedown'), false);
target.addEventListener('webkitmouseforceup', addLog.bind(this, 'webkitmouseforceup'), false);
target.addEventListener('webkitmouseforcewillbegin', prepare, false);
target.addEventListener('webkitmouseforcechanged', change, false);
