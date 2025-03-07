async function setTotalCount() {
  const data = await (
    await fetch('http://localhost:3000/pokemon/count')
  ).json();
  document.querySelector('#total-pokemon').innerText = data.count;
}

async function setCountBasedOnTypes() {
  const data = await (
    await fetch('http://localhost:3000/pokemon/types')
  ).json();

  data.types.forEach((group) => {
    const div = document.createElement('div');
    div.className = 'type';
    const innerDiv1 = document.createElement('div');
    const innerDiv2 = document.createElement('div');
    innerDiv1.className = 'innerDiv';
    innerDiv2.className = 'innerDiv';

    div.style.backgroundColor =
      group.type === 'fire'
        ? '#800000'
        : group.type === 'electric'
        ? '	#ffbf00'
        : group.type === 'water'
        ? 'lightblue'
        : group.type === 'grass'
        ? 'green'
        : group.type === 'ice'
        ? 'cyan'
        : group.type === 'fighting'
        ? 'brown'
        : group.type === 'poison'
        ? 'purple'
        : group.type === 'ground'
        ? 'saddlebrown'
        : group.type === 'flying'
        ? 'skyblue'
        : group.type === 'psychic'
        ? 'pink'
        : group.type === 'bug'
        ? 'olive'
        : group.type === 'rock'
        ? 'gray'
        : group.type === 'ghost'
        ? 'darkviolet'
        : group.type === 'dragon'
        ? 'indigo'
        : group.type === 'dark'
        ? 'black'
        : group.type === 'steel'
        ? 'silver'
        : group.type === 'fairy'
        ? 'lightpink'
        : 'white';

    innerDiv1.innerText = group.type.toUpperCase();
    innerDiv2.innerText = group.count;
    div.appendChild(innerDiv1);
    div.appendChild(innerDiv2);
    document.querySelector('#types').appendChild(div);
  });
}

setTotalCount();
setCountBasedOnTypes();
