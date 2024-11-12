import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";

const HomePage = () => {
  const navigate = useNavigate();

  const goToPreviEdit = () => {
    navigate("/PreviEdit");
  };

  const goToSeePrevi = () => {
    navigate("/SeePrevi");
  };

  const goToInsertM3C = () => {
    navigate("/InsertM3C");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cover bg-center bg-landscape flex flex-col justify-around items-center">
        <div className="flex justify-between items-center w-full max-w-[1200px] mt-8 px-8">

          {/* Modify Previ Block */}
          <div className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105" onClick={goToPreviEdit}>
            <div className="w-[300px] h-[300px] m-7 bg-[#a1000e] flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <div className="text-white text-6xl font-bold">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M168.65 141.421L144.323 135.601L117.204 108.461L138.097 87.5774C142.95 89.2818 147.994 90.1146 153.015 90.1142C164.759 90.1134 176.361 85.5539 184.989 76.9347C198.348 63.5896 201.968 43.1297 193.998 26.0239L190.303 18.0923L168.311 40.0501L158.099 29.8484L180.097 7.88489L172.136 4.18231C155.023 -3.77585 134.554 -0.159582 121.201 13.1798C108.886 25.4828 104.847 43.8341 110.537 60.0281L102.317 68.244L41.7414 7.62515C37.2174 3.08242 31.1926 0.576679 24.7763 0.569317C24.7669 0.569317 24.7583 0.569317 24.7489 0.569317C18.3338 0.569317 12.3038 3.06606 7.76588 7.60266C3.22309 12.1491 0.723432 18.1913 0.726702 24.6168C0.729971 31.0374 3.23167 37.0744 7.76997 41.6134L68.3278 102.217L60.0903 110.451C43.8842 104.758 25.5148 108.79 13.198 121.094C-0.160604 134.439 -3.78135 154.898 4.18927 172.004L7.88481 179.936L29.8757 157.978L40.0877 168.18L18.0902 190.143L26.0519 193.846C32.1065 196.661 38.5796 198.028 45.011 198.028C56.7565 198.027 68.358 193.468 76.9863 184.848C89.3015 172.545 93.3399 154.194 87.6507 138L108.528 117.132L135.653 144.278L141.468 168.625L172.818 200L200 172.796L168.65 141.421ZM123.304 58.9004C117.508 46.458 120.144 31.5741 129.863 21.8644C137.334 14.4012 147.861 11.1158 157.993 12.6203L140.741 29.8459L168.309 57.3854L185.573 40.1479C187.084 50.2665 183.798 60.7861 176.327 68.2493C166.599 77.9676 151.687 80.6009 139.219 74.802L135.335 72.9953L121.192 87.1311L110.988 76.9196L125.118 62.7961L123.304 58.9004ZM12.9879 24.6103C12.9863 21.4648 14.2108 18.5063 16.4333 16.2815C18.6539 14.0621 21.6064 12.8399 24.7493 12.8399C27.9009 12.8436 30.8464 14.0678 33.0645 16.2946L112.516 95.8027L95.8776 112.434L16.4387 32.9349C14.2153 30.711 12.9896 27.7545 12.9879 24.6103ZM68.3241 176.164C60.8529 183.627 50.3254 186.912 40.194 185.408L57.446 168.182L29.8782 140.643L12.6144 157.88C11.103 147.762 14.3894 137.242 21.8606 129.779C31.5882 120.061 46.5008 117.427 58.968 123.226L62.8528 125.032L76.9977 110.894L87.2019 121.106L73.0696 135.232L74.8843 139.128C80.6802 151.57 78.0436 166.453 68.3241 176.164ZM152.588 162.4L149.496 149.456L162.43 152.55L182.661 172.796L172.818 182.646L152.588 162.4Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <p className="text-white text-xl text-center pb-6">Modifier le prévisionnel</p>
          </div>

          {/* Insert M3C Block */}
          <div className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105" onClick={goToInsertM3C}>
            <div className="w-[300px] h-[300px] m-7 bg-[#a1000e] flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <div className="text-white text-8xl font-bold">M3C</div>
            </div>
            <p className="text-white text-xl text-center pb-6">Insérer un M3C</p>
          </div>

          {/* See Previ Block */}
          <div className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105" onClick={goToSeePrevi}>
            <div className="w-[300px] h-[300px] m-7 bg-[#a1000e] flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <div className="text-white text-6xl font-bold">
              <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_81_589)">
                    <path
                      d="M0 81.4C0 70.4667 2.13333 59.9333 6.4 49.8C10.6667 39.6667 16.4667 31 23.8 23.8C31.1333 16.6 39.8 10.8667 49.8 6.6C59.8 2.33333 70.3333 0.133333 81.4 0C92.4667 0 103 2.2 113 6.6C123 11 131.667 16.7333 139 23.8C146.333 30.8667 152.133 39.5333 156.4 49.8C160.667 60.0667 162.8 70.6 162.8 81.4C162.8 96.4667 158.667 110.667 150.4 124L194.6 168C198.2 171.733 200 176.2 200 181.4C200 186.6 198.2 191 194.6 194.6C191 198.2 186.533 200 181.2 200C175.867 200 171.467 198.2 168 194.6L124 150.6C110.667 158.733 96.4667 162.8 81.4 162.8C70.3333 162.8 59.8 160.667 49.8 156.4C39.8 152.133 31.1333 146.333 23.8 139C16.4667 131.667 10.6667 123.067 6.4 113.2C2.13333 103.333 0 92.7333 0 81.4ZM25 81.4C25 91.6667 27.5333 101.133 32.6 109.8C37.6667 118.467 44.5333 125.267 53.2 130.2C61.8667 135.133 71.2667 137.667 81.4 137.8C89 137.8 96.2667 136.333 103.2 133.4C110.133 130.467 116.133 126.467 121.2 121.4C126.267 116.333 130.267 110.333 133.2 103.4C136.133 96.4667 137.667 89.1333 137.8 81.4C137.933 73.6667 136.4 66.3333 133.2 59.4C130 52.4667 126 46.5333 121.2 41.6C116.4 36.6667 110.4 32.6667 103.2 29.6C96 26.5333 88.7333 25 81.4 25C71.2667 25 61.8667 27.5333 53.2 32.6C44.5333 37.6667 37.6667 44.5333 32.6 53.2C27.5333 61.8667 25 71.2667 25 81.4Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_81_589">
                      <rect width="200" height="200" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-white text-xl text-center pb-6">Consulter le prévisionnel</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
