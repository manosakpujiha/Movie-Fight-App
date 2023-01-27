export const debounce = (func, delay=1000) => {
    let timeoutId;
   return (...args) => {
    if (timeoutId) {
        console.log('clear', timeoutId);
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        func.apply(null,args);
    }, delay);
    }
} 

export const fetchData = async (search) => {
    countCalls('movie list');
    const response = await axios.get('http://www.omdbapi.com/', {
        params : {
            apikey : 'f5da8037',
            s : search,
        }
    });
    if (response.data.Error) return [];
    return response.data.Search;
}

export const fetchMovieDetails = async (imdbID) => {
    countCalls('movie detail');
    const response = await axios.get('http://www.omdbapi.com/', {
        params : {
            apikey : 'f5da8037',
            i : imdbID,
        }
    });
    if (response.data.Error) return [];
    return response.data;
}

function countCalls(who) {
    // Get current date
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    // Check if a count for today's date already exists in local storage
    let count = localStorage.getItem(date);
    console.log(`Server requests for today (${date}) =`, count, who);

    if (count === null) {
        // If not, set count to 1
        count = 1;
    } else {
        // If yes, increment count
        count = parseInt(count) + 1;
    }
    // Save count to local storage with today's date as the key
    localStorage.setItem(date, count);
    
    // Return the current count
    return count;
}