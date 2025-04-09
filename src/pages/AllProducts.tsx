import {Link} from "react-router-dom";
import images from "../utils/images.ts";

export default function AllProducts() {
    return (
        <section className="products section">
            <div className="container">
                <div className="row">

                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <span className="bage">Sale</span>
                                <img className="img-fluid" src={images.contenedorP} alt="foto"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Reef Boardsport</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-2.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-3.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <Link to="#"><i className="tf-ion-ios-heart"></i></Link>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Strayhorn SP</a></h4>
                                <p className="price">$230</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-4.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Bradley Mid</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-5.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-6.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <span className="bage">Sale</span>
                                <img className="img-responsive" src="images/shop/products/product-7.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-8.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="product-item">
                            <div className="product-thumb">
                                <img className="img-responsive" src="images/shop/products/product-9.jpg"
                                     alt="product-img"/>
                                <div className="preview-meta">
                                    <ul>
                                        <li>
									<span data-toggle="modal" data-target="#product-modal">
										<i className="tf-ion-ios-search-strong"></i>
									</span>
                                        </li>
                                        <li>
                                            <a href="#"><i className="tf-ion-ios-heart"></i></a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="tf-ion-android-cart"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="product-content">
                                <h4><a href="product-single.html">Rainbow Shoes</a></h4>
                                <p className="price">$200</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}