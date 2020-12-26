
function JSWIN() {
    function getStyleText(n) {
        return (typeof n === 'number') ? n + 'px' : n
    }

    var app = {
        settings: {
            titleHeight: 18,
            feelX: 8,
            feelY: 8,
            defaultTitle: 'window',
            backgroundColor: 'white'
        }

    };

    app.createWindow = function (elp, title, pars) {
        var el
        if (typeof elp === 'string') {
            if (elp[0] === '#') {
                el = document.querySelector(elp)
            } else if (elp.startsWith('http') || (pars && pars.html)) {
                el = document.createElement('div');
                var el2 = document.createElement('iframe');
                el2.src = elp
                el2.style.width = '100%';
                el2.style.height = '100%'
                el.appendChild(el2)
            } else {
                el = document.createElement('div');
                el.innerHTML = elp
            }
        } else {
            el = elp
        }

        var b = document.querySelector('body');
        fw = crad2(b, 'div','','.jswin-main')

        var t = crad2(fw, 'div',
            '<span>'+ (title ? title : app.settings.defaultTitle) +
                '</span><span class="closepp">✖</span>',
            {class: 'jstitle', style: 'height:' + getStyleText(app.settings.titleHeight) +
            '; font-size: ' + getStyleText(app.settings.titleHeight * 0.8)
            })

        var closeBtn = t.querySelector('.closepp')
        closeBtn.addEventListener('click', ((fw) => (e) => {
            fw.parentNode.removeChild(fw)
        })(fw))

        el.classList.add('jswin-container')

        fw.appendChild(el)
        fw.jswin = {}

        el3 = document.createElement('div')
        el3.classList.add('jswin-cover')
        
        fw.appendChild(el3)
        fw.jswin.el = el
        fw.jswin.el3 = el3
        fw.style.zIndex = currZ;
        currZ++;

        activeWindows.push(fw);
        activeActiveWindow = fw;

        if (pars) {
            if (pars.l) {
                fw.style.left = pars.l + 'px'
            }
            if (pars.s) {
                if (Array.isArray(pars.s)) {
                    let w = pars.s[0]
                    if (typeof pars.s[0] === 'number') w += 'px'
                    fw.style.width = w;
                    let h = pars.s[1] + app.settings.titleHeight
                    fw.style.height = pars.s[1] //+ 'px'
                    if (typeof pars.s[1] === 'number') h += 'px'
                    fw.style.height = h
                }
                if (pars.s === 'inherit') {
                    let r = el.getBoundingClientRect();
                    fw.style.width = r.right - r.left + 'px'
                    fw.style.height = r.bottom - r.top - app.settings.titleHeight+ 'px'
                    setAttr(fw, 'height',  r.bottom - r.top )
                }
            }

            if (pars.t) fw.style.top = pars.t + 'px'
            if (pars.trans) {
                modeTrans = 'start';
                var origLeft = fw.style.left;
                var origTop = fw.style.top
                fw.style.transition = 'all '+ pars.trans / 1000 + 's'
                fw.style.left = mx - parseInt(fw.style.width) / 2+ 'px';
                fw.style.top = my - parseInt(fw.style.height) / 2 + 'px'
                fw.style.transform = 'scale(0.1)'
                setTimeout(() => {
                    fw.style.transform = 'scale(1)'
                    //fw.style.left = origLeft
                    fw.style.top  = origTop
                    fw.style.left = origLeft
                    setTimeout(() => fw.style.transition = '', pars.trans)
                }, 30)
            } // trans
        } // pars
        el.style.height = 'calc(100% - ' + app.settings.titleHeight + 'px)'
        el.style.width = '100%'

        return fw;
    } //                                                             CREATE WINDOW

    var mx = 0
    var my = 0
    var el3

    var currZ = 100;
    activeWindows = []
    var currOver = {}
    var dx = 0; var dy = 0;
    var activeActiveWindow = 0;
    var modeTrans = 0

    var draggingBorder = 0
    var modeTrans = 0
    var fw
    var currTarget = document.querySelector('body');

    function getWindowRects(el) {

        var sx = app.settings.feelX; var sy = app.settings.feelY
        var sx2 = sx / 2; var sy2 = sy / 2
        var r = {};
        var w = el.getBoundingClientRect();
        r.w = {l: w.left + sx2, r: w.right - sx2, t: w.top + sy2, b: w.bottom - sy2}
        r.r = {l: w.right - sx2, r: w.right + sx2, t: w.top + sy2, b: w.bottom - sy2}
        r.b = {l: w.left + sx2, r: w.right - sx2, t: w.bottom - sy2, b: w.bottom + sy2}
        r.l = {l: w.left - sx2, r: w.left + sx2, t: w.top + sy2, b: w.bottom - sy2}
        r.t = {l: w.left + sx2, r: w.right - sx2, t: w.top - sy2, b: w.top + sy2}
        r.br = {l: w.right - sx2, r: w.right + sx2, t: w.bottom - sy2, b: w.bottom + sy2}
        r.header1 = {
            l: w.left + sx2, r: w.right - sx2, t:w.top+sx2, b: w.top + app.settings.titleHeight
        }
        return r
    }

    function isInArea(p, area) {
        return (p.x > area.l && p.x < area.r && p.y > area.t && p.y < area.b)
    }

    function setAttr(el, attr, value1) {
        return
        //var el = currOver.w;
        var value = getStyleText(value1)
        var el2 = el.querySelectorAll('div')[1];
        el.style[attr] = value;
        if (attr === 'height') {
            el2.style[attr] = 'calc(100% - ' + app.settings.titleHeight + 'px)';
        } else {
            el2.style[attr] = value;
        }
    }



    window.addEventListener('mousemove', (e) => {
        currTarget.style.cursor = '';
        currTarget = e.target

        var sx = app.settings.feelX; var sy = app.settings.feelY
        var sx2 = sx / 2; var sy2 = sy / 2
        
        mx = e.x; my = e.y
        if (draggingBorder) {
            e.preventDefault()
            let el = currOver.w;
            //console.log('currOver ', currOver)
            if (currOver.side == 'r') {
                draggingBorder.style.width = e.x - dx + sx2 + 'px'
                //setAttr(el, 'width',  e.x - dx + sx2 + 'px')
            };
            if (currOver.side == 'b') {
                draggingBorder.style.height = e.y - dy + sy2 + 'px'
                setAttr(el, 'height', e.y - dy + sy2 )//+ 'px')
            }
            if (currOver.side == 'l') {
                draggingBorder.style.width = dx - e.x + 'px'
                setAttr(el, 'width', dx - e.x + 'px')
                draggingBorder.style.left = e.x  + 'px'
            }
            if (currOver.side == 't') {
                draggingBorder.style.height = dy - e.y  - app.settings.titleHeight+ 'px'
                setAttr(el, 'height', dy - e.y - app.settings.titleHeight+ 'px')
                draggingBorder.style.top = e.y  + 'px'
            }
            if (currOver.side == 'header1') {
                draggingBorder.style.left = e.x - dx + 'px'
                draggingBorder.style.top = e.y - dy + 'px'
            }
            if (currOver.side == 'br') {
                draggingBorder.style.height = e.y - dy + sx2 + 'px'
                draggingBorder.style.width = e.x - dx + sy2 + 'px'
                //setAttr(el, 'width' , e.x - dx + sy2 + 'px')
                setAttr(el, 'height', e.y - dy + sx2 + 'px')
            }

            /*
            var el2 = el.querySelectorAll('div')[1];
            el2.style.backgroundColor = 'wheat'

            el2.style.width = '100%'
*/
            e.stopImmediatePropagation()

            return
        } // draggin border

        else {
        console.log('after drag border')

        //var el = document.querySelector('.jswindow')
        var aw = []
        if (activeActiveWindow) {
            aw = [activeActiveWindow]
        }
        var aww = aw.concat(activeWindows)

        function getCurrOver(e, areas, el) {
            if (isInArea(e, areas.br)) {
                el.jswin.el3.style.zIndex = 9998
                e.target.style.cursor = 'nwse-resize'
                return {w: el, side: 'br'}
            }
            if (isInArea(e, areas.r)) {
                el.jswin.el3.style.zIndex = 9998
                e.target.style.cursor = 'col-resize'
                console.log('rrrrrrrrrrrrrrrrrrrrr')
                return {w: el, side: 'r'}
            };
            if (isInArea(e, areas.b)) {
                el.jswin.el3.style.zIndex = 9998
                e.target.style.cursor = 'row-resize'
                return {w: el, side: 'b'}
            }
            if (isInArea(e, areas.l)) {
                el.jswin.el3.style.zIndex = 9998
                e.target.style.cursor = 'col-resize'
                return {w: el, side: 'l'}
            }
            if (isInArea(e, areas.t)) {
                el.jswin.el3.style.zIndex = 9998
                e.target.style.cursor = 'row-resize'
                return {w: el, side: 't'}
            }
            if (isInArea(e, areas.header1)) {
                el.jswin.el3.style.zIndex = -9998
                el.style.cursor = ''
                return {w: el, side: 'header1'}
            }

            if (isInArea(e, areas.w)) {
                el.jswin.el3.style.zIndex = -9998
                el.style.cursor = ''
                document.querySelector('body').style.cursor = '';
                return {w: el, side: 'w'}
            }
            return 0
        }

        for (var i = 0; i<aww.length; i++) {
            var el = aww[i]
            var areas = getWindowRects(el);

            currOver = getCurrOver(e, areas, el)
            e.stopImmediatePropagation()

            if (currOver) {
                console.log('currOver: ', currOver);
                return;
            }
        }
        currOver = '';
        e.target.style.cursor = ''
        document.querySelector('body').style.cursor = '';
        }
        //e.stopImmediatePropagation()

    }, true); // mouse move

    window.addEventListener('mousedown', (e) => {
        /*
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
*/
        if (currOver.w) {

            var el = currOver.w
            activeActiveWindow = el;
            currZ++;
            el.style.zIndex = currZ
            var b = el.getBoundingClientRect();

            console.log('down ', currOver.w.innerHTML)
            var side = currOver.side;
            if (side == 'r') {
                draggingBorder = currOver.w;
                dx =  b.left;
            }
            if (side == 'b') {
                draggingBorder = currOver.w;
                dy = b.top;
            }
            if (side == 'l') {
                draggingBorder = currOver.w;
                dx = b.right;
            }
            if (side == 't') {
                draggingBorder = currOver.w;
                dy = b.bottom;
            }
            if (side == 'header1') {
                draggingBorder = currOver.w
                dx = e.x - b.left
                dy = e.y - b.top
            }
            if (side == 'br') {
                draggingBorder = currOver.w;
                dy = b.top;
                dx = b.left;
            }
            currOver.w.style.border = '1px solid red'
        }
        console.log('dxdy', dx, dy)

    }, true) // mouse down

    window.addEventListener('mouseup', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        draggingBorder=0

        if (currOver.w) {
            e.preventDefault()
            e.stopImmediatePropagation()
            currOver.w.style.border = '1px solid black'

        }
        currOver = ''
    }, true)




    function crad2(parent, tagName, inner, attr) {
        var r = document.createElement(tagName);
        parent.appendChild(r);
        if (inner) r.innerHTML = inner;
        if (attr) {
            if (typeof(attr) === 'string') {
                if (attr.charAt(0) === '.') {
                    r.classList.add(attr.split('.')[1])
                };
                if (attr.includes(":")) {
                    r.setAttribute('style', attr)
                }
            } else if (typeof(attr) === 'object') {
                var keys = Object.keys(attr);
                keys.map(e => {
                    if (e == 'click') {
                        r.addEventListener(e, attr[e])
                    } else {
                        let val = attr[e];
                        r.setAttribute(e, val);
                    }

                })
            } else if (typeof(attr) === 'function') {
                r.addEventListener('click', attr)
            }
        }
        return r;
    }


    return app;

} // JSWIN























