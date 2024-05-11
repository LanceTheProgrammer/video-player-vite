import React, { useEffect, useState } from "react";
import "./Recommended.css";
import { API_KEY } from "../../data";
import { value_converter } from "../../data";
import { Link } from "react-router-dom";


const Recommended = ({ categoryId }) => {
  // State variable to store fetched data
  const [apiData, setApiData] = useState([]);

  // Fetch data from YouTube API
  const fetchData = async () => {
    // URL for fetching related videos
    const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    // Fetching data
    await fetch(relatedVideo_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items));
  };

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="recommended">
      {/* Mapping through fetched data and rendering side-video-list for each item */}
      {apiData.map((item, index) => {
        return (
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
            {/* Displaying video thumbnail */}
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <div className="vid-info">
              {/* Displaying video title */}
              <h4>{item.snippet.title}</h4>
              {/* Displaying channel title */}
              <p>{item.snippet.channelTitle}</p>
              {/* Displaying view count */}
              <p>{value_converter(item.statistics.viewCount)} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;
