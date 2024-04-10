import { Button, Card, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";

type faction = {
  name: string;
  reach: number;
  militant: boolean;
  color: string;
};

type hireling = {
  name: string;
  basedOn: string;
  demoted: boolean;
  demotedName: string;
  color: string;
};

function App() {
  const [factions, setFactions] = useState<faction[]>([]);
  const [map, setMap] = useState<number>(1);
  const [deck, setDeck] = useState<number>(1);
  const [hirelings, setHirelings] = useState<hireling[]>([]);

  const hirelingFactions = [
    {
      name: "Highway Bandits",
      basedOn: "none",
      demoted: false,
      demotedName: "Bandit Gangs",
      color: "#F15596",
    },
    {
      name: "Forest Patrol",
      basedOn: "Marquise de Cat",
      demoted: false,
      demotedName: "Feline Physicians",
      color: "#FF8500",
    },
    {
      name: "Last Dynasty",
      basedOn: "Eyrie Dynasties",
      demoted: false,
      demotedName: "Bluebird Nobles",
      color: "#3A97D4",
    },
    {
      name: "Spring Uprising",
      basedOn: "Woodland Alliance",
      demoted: false,
      demotedName: "Rabbit Scouts",
      color: "#589D2E",
    },
    {
      name: "The Exile",
      basedOn: "Vagabond",
      demoted: false,
      demotedName: "The Brigand",
      color: "#8B9594",
    },
    {
      name: "Riverfolk Flotilla",
      basedOn: "Riverfolk Company",
      demoted: false,
      demotedName: "Otter Divers",
      color: "#0DC7BF",
    },
    {
      name: "Warm Sun Prophets",
      basedOn: "Lizard Cult",
      demoted: false,
      demotedName: "Lizard Envoys",
      color: "#EDF32D",
    },
  ];

  const decks = ["error", "🗡️ Standard Deck", "🏹 Exiles and Partisans Deck"];

  const maps = [
    "error",
    "🍁 Autumn Map",
    "❄️ Winter Map",
    "🛶 Lake Map",
    "⛰️ Mountain Map",
  ];

  const resetState = () => {
    setFactions([]);
    setMap(1);
    setDeck(1);
    setHirelings([]);
  };

  const handlePress = (numberOfPlayers: number) => {
    resetState();
    const selectedFactions = selectFactions(numberOfPlayers);
    setFactions(selectedFactions!);
    if (
      numberOfPlayers < 4 ||
      (numberOfPlayers === 4 && Math.floor(Math.random() * 6) % 2 === 0)
    ) {
      selectHirelings(selectedFactions!, numberOfPlayers);
    }

    if (numberOfPlayers < 4) {
      setDeck(2);
    } else {
      setDeck(1);
    }
    if (numberOfPlayers === 4) {
      const chosenDeck = Math.floor(Math.random() * 2) + 1;
      setDeck(chosenDeck);
    }
    setMap(Math.floor(Math.random() * 4) + 1);
  };

  const selectHirelings = (
    selectedFactions: faction[],
    numberOfPlayers: number
  ) => {
    const chosenFactions = selectedFactions.map((faction) => faction.name);

    const eligibleHirelings = hirelingFactions.filter(
      (faction) => chosenFactions.indexOf(faction.basedOn) < 0
    );

    const selectedHirelings: hireling[] = [];
    const usedHirelings: number[] = [];
    while (selectedHirelings.length < 3) {
      const pickedHirelingIndex = Math.floor(
        Math.random() * eligibleHirelings.length
      );
      if (usedHirelings.indexOf(pickedHirelingIndex) === -1) {
        selectedHirelings.push(eligibleHirelings[pickedHirelingIndex]);
        usedHirelings.push(pickedHirelingIndex);
      }
    }
    if (numberOfPlayers > 2) {
      selectedHirelings[2].demoted = true;
    }
    if (numberOfPlayers > 3) {
      selectedHirelings[1].demoted = true;
    }
    setHirelings(selectedHirelings);
  };

  const selectFactions = (numberOfPlayers: number): faction[] => {
    const militantFactions = [
      { name: "Marquise de Cat", reach: 10, militant: true, color: "#FF8500" },
      {
        name: "Lord of the Hundreds",
        reach: 9,
        militant: true,
        color: "#FC797B",
      },
      { name: "Keepers in Iron", reach: 8, militant: true, color: "#B1BABA" },
      { name: "Underground Duchy", reach: 8, militant: true, color: "#F3AF84" },
      { name: "Eyrie Dynasties", reach: 7, militant: true, color: "#3A97D4" },
    ];

    const insurgentFactions = [
      { name: "Vagabond", reach: 5, militant: false, color: "#8B9594" },
      {
        name: "Riverfolk Company",
        reach: 5,
        militant: false,
        color: "#0DC7BF",
      },
      {
        name: "Woodland Alliance",
        reach: 3,
        militant: false,
        color: "#589D2E",
      },
      {
        name: "Corvid Conspiracy",
        reach: 3,
        militant: false,
        color: "#9B5DA9",
      },
      { name: "Lizard Cult", reach: 2, militant: false, color: "#EDF32D" },
    ];

    const reachValues = [0, 0, 17, 18, 21, 25, 28];

    const combinedFactions = [...militantFactions, ...insurgentFactions];
    const selectedFactions: faction[] = [];

    while (selectedFactions.length < numberOfPlayers) {
      const randomNumber =
        selectedFactions.length > 0
          ? Math.floor(Math.random() * combinedFactions.length)
          : Math.floor(Math.random() * militantFactions.length);
      const randomFaction =
        selectedFactions.length > 0
          ? combinedFactions[randomNumber]
          : militantFactions[randomNumber];
      if (
        selectedFactions.filter((fact) => fact.name === randomFaction.name)
          .length < 1
      ) {
        selectedFactions.push(randomFaction);
      }
    }

    let totalReach: number = 0;

    selectedFactions.forEach((faction) => (totalReach += faction.reach));
    if (totalReach >= reachValues[numberOfPlayers]) {
      return selectedFactions;
    } else {
      return selectFactions(numberOfPlayers);
    }
  };

  const playerCounts = [2, 3, 4, 5, 6];

  return (
    <div className="App">
      <div>
        <Heading>rootfactionator</Heading>
        <Text>
          Choose seats ahead of time, then click your player count to set up a
          game:
        </Text>
        <div className="buttonRow">
          {playerCounts.map((count) => (
            <Button key={count} onClick={() => handlePress(count)}>
              {count}
            </Button>
          ))}
        </div>
      </div>
      <hr />
      {factions && factions.length > 0 && (
        <>
          <h3>{maps[map]}</h3>
          <h3>{decks[deck]}</h3>
          <hr />
        </>
      )}
      {hirelings && hirelings.length > 0 && (
        <>
          <div className="factionContainer">
            {hirelings.map((hireling, i) => (
              <Card
                width="60vw"
                height="8vh"
                margin="5px"
                padding="5px"
                backgroundColor={hireling.color}
                key={i}
              >
                Hireling #{i + 1}:{" "}
                {hireling.demoted ? hireling.demotedName : hireling.name}{" "}
                {hireling.demoted && " (D)"}
              </Card>
            ))}
          </div>
          <hr />
        </>
      )}
      <div className="factionContainer">
        {factions.map((faction, i) => (
          <Card
            width="80vw"
            height="8vh"
            margin="5px"
            padding="5px"
            backgroundColor={faction.color}
            key={i}
          >
            <Text fontSize="2xl" alignSelf="center">
              Player {i + 1}: {faction.name} {faction.militant && " ⚔️"}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
