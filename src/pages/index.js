import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";
import Button from "@components/Button";
import useSWR from "swr"; // allows us to fetch data

import styles from "@styles/Home.module.scss";

const DEFAULT_CENTER = [38.907132, -77.036546]; // default map coordinates when opening up the app
const fetcher = (url) => fetch(url).then((res) => res.json()); // telling SWR how to fetch the data

export default function Home() {
  const { data } = useSWR(
    "https://firebasestorage.googleapis.com/v0/b/santa-tracker-firebase.appspot.com/o/route%2Fsanta_en.json?alt=media&2018b",
    fetcher
  ); // telling SWR where to fetch the data
  const currentDate = new Date(Date.now());
  const currentYear = currentDate.getFullYear();

  const destinations = data?.destinations.map((destination) => {
    const { arrival, departure } = destination;

    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);

    arrivalDate.setFullYear(currentYear);
    departureDate.setFullYear(currentYear);

    return {
      ...destination,
      arrival: arrivalDate.getTime(),
      departure: departureDate.getTime(),
    };
  });
  console.log(destinations);

  return (
    <Layout>
      <Head>
        <title>Leaflet</title>
        <meta
          name="description"
          content="Create mapping apps with Next.js Leaflet Starter"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <Map
            className={styles.homeMap}
            // width="800"
            // height="400"
            center={[0, 0]}
            zoom={2}
          >
            {({ TileLayer, Marker, Popup }, Leaflet) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {destinations?.map(
                  ({ id, arrival, departure, location, city, region }) => {
                    // all this code is to transform the date from the GET req
                    const arrivalDate = new Date(arrival);
                    const arrivalHours = arrivalDate.getHours();
                    const arrivalMinutes = arrivalDate.getMinutes();
                    const arrivalTime = `${arrivalHours}:${arrivalMinutes}`;

                    const departureDate = new Date(departure);
                    const departureHours = departureDate.getHours();
                    const departureMinutes = departureDate.getMinutes();
                    const departureTime = `${departureHours}:${departureMinutes}`;

                    let iconUrl = "/images/tree-marker-icon.png";
                    let iconRetinaUrl = "/images/tree-marker-icon-2x.png";
                    // changing the icon based on a condition
                    const santaWasHere =
                      currentDate.getTime() - departureDate.getTime() > 0;
                    const santaIsHere =
                      currentDate.getTime() - arrivalDate.getTime() > 0 &&
                      !santaWasHere;

                    if (santaIsHere) {
                      iconUrl = "/images/santa-marker-icon.png";
                      iconRetinaUrl = "/images/santa-marker-icon-2x.png";
                    }

                    if (santaWasHere) {
                      iconUrl = "/images/gift-marker-icon.png";
                      iconRetinaUrl = "/images/gift-marker-icon-2x.png";
                    }

                    return (
                      <Marker
                        key={id}
                        position={[location.lat, location.lng]}
                        icon={Leaflet.icon({
                          iconUrl,
                          iconRetinaUrl,
                          iconSize: [41, 41],
                        })}
                      >
                        <Popup>
                          <strong>Location:</strong> {city}, {region}
                          <br />
                          <strong>
                            Arrival:
                          </strong> {arrivalDate.toDateString()} @ {arrivalTime}
                          <br />
                          <strong>Departure:</strong>{" "}
                          {departureDate.toDateString()} @ {departureTime}
                        </Popup>
                      </Marker>
                    );
                  }
                )}
              </>
            )}
          </Map>

          <a
            className={styles.description}
            href="https://github.com/colbyfayock/next-leaflet-starter"
            rel="noreferrer"
            target="_blank"
          >
            <code className={styles.code}>
              yarn create next-app -e
              https://github.com/colbyfayock/next-leaflet-starter
            </code>
          </a>
        </Container>
      </Section>
    </Layout>
  );
}
