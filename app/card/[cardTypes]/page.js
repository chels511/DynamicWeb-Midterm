"use client";

import Header from "@/app/components/Header";
import yugicards from "@/app/components/yugicards.json";
import styles from "@/app/page.module.css";
import { useState, useEffect } from "react";

const rarityMapping = {
  Common: "Common",
  Rare: "Rare",
  "Super Rare": "Rare Holo",
  "Ultra Rare": "Rare Holo GX",
  "Secret Rare": "Uncommon",
  "Ultimate Rare": "Rare Ultra",
  "Prismatic Secret Rare": "Rare Holo EX",
  "Short Print": "Promo",
  "Duel Terminal Normal Parallel Rare": "Rare Holo VMAX",
  "Collector's Rare": "Rare Holo V",
};

const cssMapping = {
  Common: {
    border: "border-common",
    background: "bg-common",
    text: "text-common",
    title: "title-common",
  },
  Rare: {
    border: "border-rare",
    background: "bg-rare",
    text: "text-rare",
    title: "title-rare",
  },
  "Super Rare": {
    border: "border-super-rare",
    background: "bg-super-rare",
    text: "text-super-rare",
    title: "title-super-rare",
  },
  "Ultra Rare": {
    border: "border-ultra-rare",
    background: "bg-ultra-rare",
    text: "text-ultra-rare",
    title: "title-ultra-rare",
  },
  "Secret Rare": {
    border: "border-secret-rare",
    background: "bg-secret-rare",
    text: "text-secret-rare",
    title: "title-secret-rare",
  },
  "Ultimate Rare": {
    border: "border-ultimate-rare",
    background: "bg-ultimate-rare",
    text: "text-ultimate-rare",
    title: "title-ultimate-rare",
  },
  "Prismatic Secret Rare": {
    border: "border-prismatic-secret-rare",
    background: "bg-prismatic-secret-rare",
    text: "text-prismatic-secret-rare",
    title: "title-prismatic-secret-rare",
  },
  "Short Print": {
    border: "border-short-print",
    background: "bg-short-print",
    text: "text-short-print",
    title: "title-short-print",
  },
  "Duel Terminal Normal Parallel Rare": {
    border: "border-duel-terminal-normal-parallel-rare",
    background: "bg-duel-terminal-normal-parallel-rare",
    text: "text-duel-terminal-normal-parallel-rare",
    title: "title-duel-terminal-normal-parallel-rare",
  },
  "Collector's Rare": {
    border: "border-collectors-rare",
    background: "bg-collectors-rare",
    text: "text-collectors-rare",
    title: "title-collectors-rare",
  },
};

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

export default function Home() {
  const [yugiohCards, setYuGiOhCards] = useState([]);
  const [pokemonRecommendations, setPokemonRecommendations] = useState(
    Array(30).fill(null)
  );
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?appid=${process.env.POKE_TCG_KEY}`
      );
      const data = await response.json();
      setPokemonData(data.data);
    };

    fetchPokemonData();

    const shuffledYugiohCards = shuffleArray(yugicards.data);
    setYuGiOhCards(shuffledYugiohCards.slice(0, 30));
  }, []);

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const recommendPokemonCard = (index) => {
    const yugiohCard = yugiohCards[index];
    const yugiohRarity =
      yugiohCard.card_sets && yugiohCard.card_sets.length > 0
        ? yugiohCard.card_sets[0].set_rarity
        : "Common";

    const pokemonRarity = rarityMapping[yugiohRarity] || "Common";
    const matchingPokemonCards = pokemonData.filter(
      (card) => card && card.rarity === pokemonRarity
    );

    const recommendedPokemonCard = getRandomItem(matchingPokemonCards);

    setPokemonRecommendations((prevRecommendations) =>
      prevRecommendations.map((rec, i) =>
        i === index ? recommendedPokemonCard : rec
      )
    );
  };

  return (
    <main className={styles.pageWrapper}>
      <Header />
      <h1 className={styles.pageHead}>Recommendations by Rarity</h1>

      <section className={styles.cardsContainer}>
        {yugiohCards.map((card, index) => {
          const yugiohRarity = card.card_sets?.[0]?.set_rarity || "Common";
          const cssClasses = cssMapping[yugiohRarity] || cssMapping["Common"];

          return (
            <div
              key={index}
              className={`${styles.card} ${styles[cssClasses.border]} ${
                styles[cssClasses.background]
              }`}
            >
              <h2 className={styles[cssClasses.title]}>{card.name}</h2>
              <p className={styles.readable}>
                <strong>Type:</strong> {card.type}
              </p>
              <p className={styles.readable}>
                <strong>Rarity:</strong> {yugiohRarity}
              </p>
              <img
                src={card.card_images[0]?.image_url}
                alt={card.name}
                width="200"
                height="300"
              />

              <button
                className={styles.recommendButton}
                onClick={() => recommendPokemonCard(index)}
              >
                Recommend Pokémon
              </button>

              {pokemonRecommendations[index] && (
                <div className={styles.recommendation}>
                  <h3 className={styles.readable}>Recommended Pokémon Card</h3>
                  <p className={styles.readable}>
                    <strong>Name:</strong> {pokemonRecommendations[index].name}
                  </p>
                  <p className={styles.readable}>
                    <strong>Rarity:</strong>{" "}
                    {pokemonRecommendations[index].rarity}
                  </p>
                  <img
                    src={pokemonRecommendations[index].images.small}
                    alt={pokemonRecommendations[index].name}
                    width="200"
                    height="300"
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
