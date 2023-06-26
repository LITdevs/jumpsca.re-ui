import Card from "../components/Card";
import "../css/home.css";
import "../css/card.css";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {Icon} from "@iconify-icon/react";

function Homepage() {

  return (
        <div className="card-container">
            <h1 className="background-text home-header">jumpsca.re your friends today</h1>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 1325: 2, 1800: 3}}>
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
                          height="12rem"
                          width="28rem"
                          bg-text="104.24"
                          bg-text-bottom="-1.75rem"
                          bg-text-right="0rem"
                          bg-text-size="10rem"/>


                    <Card title="Host your website on jumpsca.re"
                          body="Every address includes free web hosting for your subdomain.\n\nUse our straightforward interface to upload your HTML, CSS, and media files. \n\nBe creative, your website could be anything, from a personal profile or portfolio to a blog or even just a picture of your cat. You have the flexibility to bring your desired website to life and make it yours."
                          color="blue"
                          height="40rem"
                          width="28rem"
                          bg-text="</>"
                          bg-text-bottom="-3.75rem"
                          bg-text-right="1rem"/>

                    <Card title="You kept reading! That's good right?"
                          body="Or maybe this is the first information card you read?\nIn any case, for just 1 €/year you can get access to these services, and your very own address under the jumpsca.re domain.\n🦀1 €🦀"
                          color="coral"
                          height="12rem"
                          width="28rem"
                          bg-text="1€"
                          bg-text-bottom="-3.5rem"
                          bg-text-right="1rem"
                          bg-text-size="16rem"/>

                    <Card title="Too little?"
                          body="If this sounded like too little, don't worry!\nIt's okay to not be interested, but remember that we are always adding more, so maybe check again later?"
                          color="yellow"
                          height="12rem"
                          width="28rem"
                          bg-text="3:"
                          bg-text-bottom="-3.5rem"
                          bg-text-right="1rem"
                          bg-text-size="18rem"/>


                </Masonry>

            </ResponsiveMasonry>

            <div className="card" style={{backgroundColor: "var(--pink)",
                width: "56rem", height: "12rem", textAlign: "center"}}>
                <div className="card-header" style={{fontSize: "2rem"}}>
                    Find out if yours is up for grabs
                </div>
                <div className="card-body">
                    <input type="text" className="address-input"></input>
                </div>
                <div className="card-bg-text" style={{color: `var(--pink-d)`, top: 0, left: 0, fontSize: "12rem"}}>
                    <Icon icon="foundation:magnifying-glass" color="#fff7ae" />
                </div>
            </div>
        </div>
  );
}

export default Homepage;
