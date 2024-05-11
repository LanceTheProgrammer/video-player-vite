import React, { useEffect, useState } from "react";
import "./Feed.css"; 
import { API_KEY, value_converter } from "../../data"; // Importing API_KEY and value_converter from data file
import { Link } from "react-router-dom";
import moment from "moment/moment"; // Importing moment library for date/time formatting

const Feed = ({ category }) => {
  const [data, setData] = useState([]); 

  // Function to fetch data from YouTube API based on selected category
  const fetchData = async () => {
    // Constructing URL for fetching video list based on category
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    // Fetching data from YouTube API
    await fetch(videoList_url)
      .then((response) => response.json()) // Parsing response to JSON format
      .then((data) => setData(data.items)); // Setting fetched data to state variable 'data'
  };

  // Effect hook to execute fetchData function whenever 'category' prop changes
  useEffect(() => {
    fetchData();
  }, [category]);

  // Rendering Feed component with fetched data
  return (
    <div className="feed">
      {data.map((item, index) => (
        // Linking each video item to its detailed view page
        <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="card" key={index}>
          {/* Displaying video thumbnail */}
          <img src={item.snippet.thumbnails.medium.url} alt="" />
          {/* Displaying video title */}
          <h2>{item.snippet.title}</h2>
          {/* Displaying video channel title */}
          <h3>{item.snippet.channelTitle}</h3>
          {/* Displaying video view count and published date */}
          <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()} </p>
        </Link>
      ))}
    </div>
  );
};

export default Feed;

