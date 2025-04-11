import {Link} from "react-router-dom";

export default function ModalProducts() {
    return (<div className="modal product-modal fade" id="product-modal">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="tf-ion-close"></i>
            </button>
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-8 col-sm-6 col-xs-12">
                                <div className="modal-image">
                                    <img className="img-responsive"
                                         src="images/shop/products/modal-product.jpg" alt="product-img"/>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-xs-12">
                                <div className="product-short-details">
                                    <h2 className="product-title">GM Pendant, Basalt Grey</h2>
                                    <p className="product-price">$200</p>
                                    <p className="product-short-description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem iusto
                                        nihil cum. Illo laborum numquam rem aut officia dicta cumque.
                                    </p>
                                    <Link to="cart.html" className="btn btn-main">Add To Cart</Link>
                                    <a href="product-single.html" className="btn btn-transparent">View
                                        Product Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
