"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import yugicards from "./components/yugicards.json";
import Header from "./components/Header";

const typeMapping = {
  Fire: "FIRE",
  Water: "WATER",
  Grass: "EARTH",
  Lightning: "LIGHT",
  Psychic: "DARK",
  Fighting: "EARTH",
  Darkness: "DARK",
  Dragon: "WIND",
  Metal: "EARTH",
  Fairy: "LIGHT",
  Colorless: "LIGHT",
};

const typeColorMapping = {
  Fire: "#FF6B6B",
  Water: "#3498DB",
  Grass: "#2ECC71",
  Lightning: "#F1C40F",
  Psychic: "#9B59B6",
  Fighting: "#E67E22",
  Darkness: "#34495E",
  Dragon: "#8E44AD",
  Metal: "#95A5A6",
  Fairy: "#FFB6C1",
  Colorless: "#BDC3C7",
};

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

export default function Home() {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [yugiohRecommendations, setYuGiOhRecommendations] = useState(
    Array(30).fill(null)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?appid=${process.env.POKE_TCG_KEY}`
      );
      const data = await response.json();
      const shuffledData = shuffleArray(data.data);
      setPokemonCards(shuffledData.slice(0, 30));
      setIsLoading(false);
    };

    fetchPokemonData();
  }, []);

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const recommendYuGiOhCard = (index) => {
    const pokemonCard = pokemonCards[index];

    if (pokemonCard) {
      const pokemonType = pokemonCard.types[0];
      const yugiohAttribute = typeMapping[pokemonType];

      const matchingYuGiOhCards = yugicards.data.filter(
        (card) => card.attribute === yugiohAttribute
      );
      const recommendedYuGiOhCard = getRandomItem(matchingYuGiOhCards);

      setYuGiOhRecommendations((prevRecommendations) =>
        prevRecommendations.map((rec, i) =>
          i === index ? recommendedYuGiOhCard : rec
        )
      );
    }
  };
  //I put a loading signal because the API information loads in slower than the JSON and a blank screen ensues for a while
  return (
    <main className={styles.pageWrapper}>
      <Header />
      <h1 className={styles.pageHead}>Recommendations by Type</h1>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <h2 className={styles.loadingTitle}>Loading...</h2>
        </div>
      ) : (
        <section className={styles.cardsContainer}>
          {pokemonCards.map((card, index) => (
            <div
              key={index}
              className={styles.card}
              style={{
                backgroundColor: typeColorMapping[card.types[0]] || "#FFFFFF",
              }}
            >
              <h2>{card.name}</h2>
              <p>
                <strong>Type:</strong> {card.types.join(", ")}
              </p>
              <p>
                <strong>Set:</strong> {card.set.series}
              </p>
              <img
                src={card.images.small}
                alt={card.name}
                width="200"
                height="300"
              />

              <button
                className={styles.recommendButton}
                onClick={() => recommendYuGiOhCard(index)}
              >
                Recommend Yu-Gi-Oh!
              </button>

              {yugiohRecommendations[index] && (
                <div className={styles.recommendation}>
                  <h3>Recommended Yu-Gi-Oh! Card</h3>
                  <p>
                    <strong>Name:</strong> {yugiohRecommendations[index].name}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {yugiohRecommendations[index].humanReadableCardType}
                  </p>
                  <p>
                    <strong>Attribute:</strong>{" "}
                    {yugiohRecommendations[index].attribute}
                  </p>
                  <img
                    src={
                      yugiohRecommendations[index].card_images[0].image_url ||
                      "/fallback.png"
                    }
                    alt={yugiohRecommendations[index].name}
                    width="200"
                    height="300"
                  />
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
