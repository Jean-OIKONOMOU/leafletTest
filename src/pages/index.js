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
  console.log(data);
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
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {data?.destinations?.map(
                  ({ id, arrival, departure, location, city, region }) => {
                    const arrivalDate = new Date(arrival); // this is supposed to be for when Santa arrives ?
                    const arrivalHours = arrivalDate.getHours();
                    const arrivalMinutes = arrivalDate.getMinutes();
                    const arrivalTime = `${arrivalHours}:${arrivalMinutes}`;

                    const departureDate = new Date(departure); // and that's for when he returns to Lappland
                    const departureHours = departureDate.getHours();
                    const departureMinutes = departureDate.getMinutes();
                    const departureTime = `${departureHours}:${departureMinutes}`;

                    return (
                      <Marker key={id} position={[location.lat, location.lng]}>
                        <Popup>
                          <strong>Location:</strong> {city}, {region}
                          <br />
                          <strong>
                            Arrival:
                          </strong> {arrivalDate.toDateString()} @ {arrivalTime}
                          <br />
                          <strong>Departure:</strong>{" "}
                          {arrivalDate.toDateString()} @ {departureTime}
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
