import Card from "../components/Card";
import "../css/home.css";
import "../css/card.css";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {Icon} from "@iconify-icon/react";
import {useState} from "react";
import api from "../util/API";

function Homepage() {
    const [availability, setAvailability] = useState(undefined);
    const [checkTimeout, setCheckTimeout] = useState(undefined);

    return (
        <div className="card-container">
            <h1 className="background-text home-header">jumpsca.re your friends today</h1>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 1325: 2, 1800: 3, 2400: 4, 3000: 5}}>
                <Masonry>
                    <Card title="Get your own @jumpsca.re email address"
                          body="Have you ever wanted to email@jumpsca.re someone?\nNow you can! Every address comes with an email address under the jumpsca.re domain."
                          color="yellow"
                          height="12rem"
                          width="28rem"
                          bg-text="@"
                          bg-text-top="-5.75rem"
                          bg-text-left="-1rem"/>

                    <Card title="Do more with DNS"
                          body="Don't want to use our services? Need to do more than what we offer? That's okay, you can take full control over your subdomain with DNS.\nEvery address comes with full customization of the DNS records associated with your address, just like any other domain."
                          color="pink"
                          width="28rem"
                          height="14rem"
                          bg-text="104.24"
                          bg-text-bottom="-1.75rem"
                          bg-text-right="0rem"
                          bg-text-size="10rem"/>


                    <Card title="Host your website on jumpsca.re"
                          body="Every address includes free web hosting for your subdomain.\n\nUse our straightforward interface to upload your HTML, CSS, and media files. \n\nBe creative, your website could be anything, from a personal profile or portfolio to a blog or even just a picture of your cat. You have the flexibility to bring your desired website to life and make it yours."
                          color="blue"
                          width="28rem"
                          height="22rem"
                          bg-text="</>"
                          bg-text-bottom="-3.75rem"
                          bg-text-right="1rem"/>

                    <Card title="You kept reading! That's good right?"
                          body="Or maybe this is the first information card you read?\nIn any case, for just 2 €/year you can get access to these services, and your very own address under the jumpsca.re domain.\n🦀2 €🦀"
                          color="coral"
                          width="28rem"
                          bg-text="2€"
                          bg-text-bottom="-3.5rem"
                          bg-text-right="1rem"
                          bg-text-size="16rem"/>

                    <Card title="Too little?"
                          body="If this sounded like too little, don't worry!\nIt's okay to not be interested, but remember that we are always adding more, so maybe check again later?"
                          color="yellow"
                          height="10rem"
                          width="28rem"
                          bg-text="3:"
                          bg-text-bottom="-4.25rem"
                          bg-text-right="1rem"
                          bg-text-size="18rem"/>

                    <Card title="Jumpsca.red"
                          body="Something exclusive for jumpsca.re customers in the future, currently unknown!"
                          color="coral"
                          bg-text=".red"
                          height="7rem"
                          width="28rem"
                          bg-text-bottom="-2rem"
                          bg-text-right="1rem"
                          bg-text-size="9rem"/>

                </Masonry>
            </ResponsiveMasonry>

            <div style={{textAlign: "center", marginBottom: "1rem"}}>
                <div className="card" style={{backgroundColor: "var(--blue)",
                    width: "59.75rem", maxWidth: "max(calc(100% - 2.8rem))", height: "10rem", textAlign: "center"}}>
                    <div className="card-header" style={{fontSize: "2rem"}}>
                        Find out if yours is up for grabs
                    </div>
                    <div className="card-body">
                        <input type="text" className="address-input" onInput={(e) => {
                            let val = e.target.value?.replace(/[./]/gm, "")
                            if (val !== e.target.value) e.target.value = val;
                            clearTimeout(checkTimeout);
                            if (!val || val?.trim()?.length === 0) return setAvailability(undefined);
                            setAvailability({checking: true})
                            setCheckTimeout(setTimeout(async () => {
                                let res = await api.getAddress(val);
                                let available = res.response.available;
                                let reserved = !!res.response?.reserved;
                                let invalid = !!res.response?.invalid;
                                let name = res.response.name;

                                let statusCode = res.statusCode;

                                let availabilityText;

                                if (!available) {
                                    availabilityText = `${name} is already taken!`;
                                    if (reserved) {
                                        availabilityText = `${name} is a system reserved address!`;
                                    }
                                    if (invalid) {
                                        availabilityText = `${name || val} is not a valid address!`;
                                    }
                                } else {
                                    availabilityText = `${name} is available!`;
                                    if (name !== val) {
                                        availabilityText = `${val} is available, but will be rendered as ${name}.`;
                                    }
                                }

                                setAvailability({
                                    available,
                                    reserved,
                                    name,
                                    statusCode,
                                    availabilityText,
                                    punycode: name !== val
                                });
                            }, 500));
                        }}></input><span>.jumpsca.re</span>
                    </div>
                    <span style={{fontSize: "1.2rem"}}>Your address could be your name, online username or something totally different!</span><br />
                    {availability &&
                    (availability.checking
                        ? <span style={{fontSize: "1.2rem"}}>Checking...</span>
                        : <span style={{fontSize: "1.2rem"}}>
                            <Icon className="text-aligned-icon" icon={availability.available ? "fluent:presence-available-24-regular" : "fluent:presence-blocked-24-regular"} />
                            {availability.availabilityText}
                        </span>)
                    }
                    <div className="card-bg-text" style={{color: `var(--blue-d)`, top: 0, left: 0, fontSize: "12rem"}}>
                        <Icon icon="foundation:magnifying-glass" color="#fff7ae" />
                    </div>
                </div>

            </div>
        </div>
  );
}

export default Homepage;
