import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { BASE_URL } from "./baseUrl";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Recipient email address is required.",
      });
      setIsSubmitting(false);
      return;
    }

    fetch(`${BASE_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          setFormData({
            name: "",
            number: "",
            email: "",
            subject: "",
            message: "",
          });
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Message sent successfully!",
          });
        } else {
          response.text().then((text) => {
            throw new Error(
              `Failed to send message. Status: ${response.status}, Message: ${text}`
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to send message. Please try again later.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <Header />
      <section
        style={{
          background: 'url("./img/1968.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "calibri",
          padding: "7em 0",
          marginBottom: "0",
        }}
        className="ftco-section ftco-no-pt"
      >
        <div
          className="container"
          style={{ marginTop: "-50px", marginBottom: "-40px" }}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "10px",
                  boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                  padding: "40px",
                  marginTop: "-30px",
                }}
                className="p-5"
              >
                <h2
                  style={{ marginTop: "-30px", marginLeft: "200px" }}
                  className=" mb-4"
                >
                  Contact Us
                </h2>

                <div className="row">
                  <div className="col-lg-6">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              style={{
                                height: "50px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                padding: "10px",
                                width: "100%",
                              }}
                              type="text"
                              className="form-control"
                              placeholder="Your Name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              style={{
                                height: "50px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                padding: "10px",
                                width: "100%",
                              }}
                              type="tel"
                              className="form-control"
                              placeholder="Your Number"
                              name="number"
                              value={formData.number}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              style={{
                                height: "50px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                padding: "10px",
                                width: "100%",
                              }}
                              type="email"
                              className="form-control"
                              placeholder="Your Email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              style={{
                                height: "50px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                padding: "10px",
                                width: "100%",
                              }}
                              type="text"
                              className="form-control"
                              placeholder="Subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <textarea
                              style={{
                                height: "80px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                padding: "10px",
                                width: "100%",
                              }}
                              className="form-control"
                              placeholder="Message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group text-center">
                            <button
                              style={{
                                padding: "15px 50px",
                                fontSize: "18px",
                                fontWeight: "bold",
                                borderRadius: "5px",
                                border: "none",
                                color: "#fff",
                                background: "#0D9250",
                                cursor: "pointer",
                              }}
                              type="submit"
                              className="btn btn-primary"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-lg-6">
                    <div className="info-wrap mt-4">
                      <h3
                        style={{ fontFamily: "calibri", marginTop: "-25px" }}
                        className=""
                      >
                        Get in Touch
                      </h3>
                      <br />
                      <div className="dbox">
                        <div className="text">
                          <p>
                            <b>
                              <span>
                                Feel free to drop us a message below. We'll get
                                back to you as soon as possible.
                              </span>
                            </b>
                          </p>
                        </div>
                        <div className="text">
                          <p>
                            <span className="fa fa-map-marker"></span>
                            <span className="ml-3" style={{fontWeight:'bold'}}></span> F6, Fabro Hotels,South St,
                            Nagercoil, India.
                          </p>
                        </div>
                      </div>
                      <div className="dbox">
                        <div className="text">
                          <p>
                            <span className="fa fa-phone"></span>
                            <span className="ml-3" style={{fontWeight:'bold'}}></span>{" "}+91 9876543210
                            {/* <a href="tel://1234567890">+1234567890</a> */}
                          </p>
                        </div>
                      </div>
                      <div className="dbox">
                        <div className="text">
                          <p>
                            <span className="fa fa-paper-plane"></span>
                            <span className="ml-3 " style={{fontWeight:'bold'}}></span>fabrohotels@gmail.com

                            {/* <a href="mailto:info@example.com">
                              info@example.com
                            </a> */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactForm;
