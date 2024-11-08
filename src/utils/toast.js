import CogoToast from 'cogo-toast';

export const showSuccess = (msg) => {
    CogoToast.success(msg, {
        position: 'top-center',
        heading: 'Success',
        hideAfter: 3
    });
};

export const showError = (msg) => {
    CogoToast.error(msg, {
        position: 'top-center',
        heading: 'Error',
        hideAfter: 5
    });
};

export const showInfo = (msg) => {
    CogoToast.info(msg, {
        position: 'top-center',
        heading: 'Information',
        hideAfter: 4
    });
};

export const showWarning = (msg) => {
    CogoToast.warn(msg, {
        position: 'top-center',
        heading: 'Warning',
        hideAfter: 4
    });
};
