import {Link} from "react-router-dom";
import {useState} from "react";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<null | "sending" | "sent" | "error">(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            // Mapeo de inglés → español
            const payload = {
                nombre:  form.name.trim(),
                email:   form.email.trim(),
                asunto:  form.subject.trim(),
                mensaje: form.message.trim(),
            };

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus("sent");
            setForm({name: "", email: "", subject: "", message: ""});
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="content">
                                <h1 className="page-name">Contáctanos</h1>
                                <ol className="breadcrumb">
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-wrapper">
                <div className="contact-section">
                    <div className="container">
                        <div className="row">
                            {/* Contact Form */}
                            <div className="contact-form col-md-6">
                                <form onSubmit={handleSubmit}>
                                    {["name", "email", "subject"].map((field) => (
                                        <div className="form-group mb-3" key={field}>
                                            <input
                                                type={field === "email" ? "email" : "text"}
                                                placeholder={field === "name" ? "Tu nombre" :
                                                    field === "email" ? "Tu correo" :
                                                        "Asunto"}
                                                className="form-control"
                                                name={field}
                                                value={form[field as keyof typeof form]}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <br/>
                                    <div className="form-group mb-3">
                                        <textarea
                                            rows={6}
                                            placeholder="Mensaje"
                                            className="form-control"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={status === "sending"}
                                    >
                                        {status === "sending" ? "Enviando…" : "Enviar"}
                                    </button>

                                    {status === "sent" && (
                                        <div className="alert alert-success mt-3">
                                            ¡Gracias! Tu mensaje ha sido enviado.
                                        </div>
                                    )}
                                    {status === "error" && (
                                        <div className="alert alert-danger mt-3">
                                            Ocurrió un error. Intenta de nuevo.
                                        </div>
                                    )}
                                </form>
                            </div>
                            {/* Contact Details */}
                            <div className="contact-details col-md-6">
                                <div className="google-map">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0374524933236!2d-72.50638242499737!3d7.891150705761184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e66455e93349cdb%3A0x8aa9d6d8b0782d46!2sPlasticos%20El%20lider!5e0!3m2!1ses!2sco!4v1743737142891!5m2!1ses!2sco"
                                        width="100%"
                                        height="300"
                                        style={{border: 0}}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>

                                <ul className="contact-short-info mt-4">
                                    <li>
                                        <i className="bi bi-house-door-fill me-2"></i>
                                        <span>Calle 6 # 4 - 18 Barrio el llano Cúcuta - Norte de Santander</span>
                                    </li>
                                    <li>
                                        <i className="bi bi-telephone-fill me-2"></i>
                                        <span>Teléfono: <Link to={"https://wa.me/573242940464"} target={"_blank"}>+57 324 294 0464 </Link></span>
                                    </li>
                                    <li>
                                        <i className="bi bi-globe me-2"></i>
                                        <span>Sitio web: <Link to={"https//:distribucioneslider.com.co"}
                                                               target={"_blank"}>www.distribucioneslider.com.co</Link></span>
                                    </li>
                                    <li>
                                        <i className="bi bi-envelope-fill me-2"></i>
                                        <span>Email: <Link to={"mailto:liderplast@gmail.com"}
                                                           target={"_blank"}> liderplast@gmail.com </Link></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}