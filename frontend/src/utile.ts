export const formatCollection = (collection: any) => {
    const id = collection[0]._isBigNumber
      ? collection[0].toNumber()
      : collection[0]
    const name = collection[1]
    const code = collection[2]
    const imgUrl = collection[3]
    const size = collection[4]._isBigNumber
      ? collection[4].toNumber()
      : collection[4]

    return { id, name, code, imgUrl, size }
}

export const formatPokemonData = (pokemonData: any) => {
    const address: string = pokemonData[0]
    const id: string = pokemonData[1]
    const imgUrl: string = pokemonData[2]
    const owner: string = pokemonData[3]
    return { address, id, imgUrl, owner }
  }