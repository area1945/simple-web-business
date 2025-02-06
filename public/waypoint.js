/* eslint-disable no-unused-vars */
try {
    document.querySelectorAll('.skills-animation').forEach((item) => {
        // eslint-disable-next-line no-undef
        new Waypoint({
            element: item,
            offset: '80%',
            handler: function () {
                let progress = item.querySelectorAll('.progress .progress-bar');
                progress.forEach(el => {
                    el.style.width = el.getAttribute('aria-valuenow') + '%';
                });
            }
        });
    });
}
catch (error) { /* empty */ }