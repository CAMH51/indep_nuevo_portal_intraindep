function abrirModal(modalId = '') {
    const $el = document.getElementById(modalId);
    const modal = new Modal($el, {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
    });
    modal.show();
}

function cerrarModal(modalId = '') {
    const $el = document.getElementById(modalId);
    const modal = new Modal($el);
    modal.hide();
}
