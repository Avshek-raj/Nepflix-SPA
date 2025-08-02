const Search = ({searchTerm, setSearchTerm}) => {
    return (
      <div className="search">
        <div>
            <img src="search.png" alt="search"></img>
            <input 
            type="text" 
            placeholder="Search through thousand if movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
        </div>
      </div>
    )
  }
  
  export default Search
  