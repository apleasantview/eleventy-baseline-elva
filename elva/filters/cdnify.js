export function cdnify(url) {
    if ((this.ctx._elva.isProduction || this.ctx._elva.isStaging) && this.ctx._elva.cdn) {
        url = 'https://i0.wp.com/' + url.replace(/^https?:\/\//, '');
    }
    return url;
}
