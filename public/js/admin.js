const deleteProduct = (mybtn) => {
    const prodId = mybtn.parentNode.querySelector('[name=prodId]').value;
    const _csrf = mybtn.parentNode.querySelector('[name=_csrf]').value;
    const product = mybtn.closest('article');

    fetch('/admin/delete-product/' + prodId, {
        method: 'delete',
        headers: {
            'csrf-token': _csrf
        }
    })
    .then(result => {
        return result.json()
    })
    .then(data => {
        console.log(data)
        // product.remove() //works only for current browsers
        product.parentNode.removeChild(product);
    })
    .catch(err => console.log(err))
}