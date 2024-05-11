import React, { useEffect, useState } from "react";
import "./PlayVideo.css"; 
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import user_profile from "../../assets/user_profile.jpg";
import { value_converter } from "../../data";
import moment from "moment"; 
import { useParams } from "react-router-dom";


const PlayVideo = () => {
  const { videoId } = useParams(); // Extracting videoId from URL parameters

  // State variables to store fetched data
  const [apiData, setApiData] = useState(null); // For video data
  const [channelData, setChannelData] = useState(null); // For channel data
  const [commentData, setCommentData] = useState([]); // For comment data

  const fetchVideoData = async () => {
    // Fetching Video Data
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  // Function to fetch other related data (channel info, comments)
  const fetchOtherData = async () => {
    // Fetching Channel Data if apiData is available
    if (apiData && apiData.snippet && apiData.snippet.channelId) {
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      await fetch(channelData_url)
        .then((res) => res.json())
        .then((data) => {
          if (data.items && data.items.length > 0) {
            setChannelData(data.items[0]);
          }
        });
    }

    // Fetching Comment Data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(comment_url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        return res.json();
      })
      .then((data) => {
        if (data.items) {
          setCommentData(data.items);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error.message);
        // Handle error
      });
  };

  // Effect hook to fetch video data when videoId changes
  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  // Effect hook to fetch other related data when apiData changes
  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  return (
    <div className="play-video">
      {/* Video player */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      {/* Video information */}
      {apiData && apiData.snippet && (
        <>
          <h3>{apiData.snippet.title}</h3>
          <div className="play-video-info">
            <p>
              {apiData ? value_converter(apiData.statistics.viewCount) : "16k"}{" "}
              Views &bull;{" "}
              {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
            </p>
            <div>
              <span>
                <img src={like} alt="" />{" "}
                {apiData ? value_converter(apiData.statistics.likeCount) : 155}
              </span>
              <span>
                <img src={dislike} alt="" /> 2
              </span>
              <span>
                <img src={share} alt="" /> Share
              </span>
              <span>
                <img src={save} alt="" /> Save
              </span>
            </div>
          </div>
        </>
      )}
      <hr />

      {/* Publisher info */}
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : ""}
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      {/* Video description and comments */}
      <div className="vid-description">
        {/* Video description */}
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "Description Here"}
        </p>
        <hr />
        {/* Comments */}
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 102}{" "}
          Comments
        </h4>
        {commentData.map((item, index) => (
          <div key={index} className="comment">
            <img
              src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
              alt=""
            />
            <div>
              <h3>
                {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                <span>
                  {moment(
                    item.snippet.topLevelComment.snippet.publishedAt
                  ).fromNow()}
                </span>
              </h3>
              <p>{item.snippet.topLevelComment.snippet.textOriginal}</p>
              <div className="comment-action">
                <img src={like} alt="" />
                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
