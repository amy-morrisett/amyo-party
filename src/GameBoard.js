function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event R is red, W is Bowser, C is chance, V is VS, S is star
  const spaces = [
    'L',
    'B',
    'CE',
    'CE',
    'B',
    'R',
    'CE',
    'CE',
    'B',
    'L',
    'B',
    'CE',
    'CE',
    'B',
    'B',
    'CE',
    'CE',
    'B',
    'L',
    'L',
    'B',
    'B',
    'B',
    'B',
    'B',
    'B',
    'L',
    'B',
    'KE',
    'B',
    'B',
    'R',
    'L',
    'B',
    'L',
    'V',
    'B',
    'CE',
    'CE',
    'R',
    'C',
    'W',
  ];
  const bowserDetourSpaces = [
    'R',
    'R',
    'R',
    'B',
    'L',
    'B',
    'B',
    'L',
    'V',
    'C',
    'W',
  ];
  return (
    <div className="GameBoard">
      {spaces.map((space) => (
        <p>{space}</p>
      ))}
    </div>
  );
}

export default GameBoard;
