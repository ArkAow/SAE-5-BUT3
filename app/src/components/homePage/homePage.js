import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import { useUser } from "../../contexts/UserContext"; // Import du UserContext

const HomePage = () => {
  const navigate = useNavigate();

  const { fullName } = useUser(); // Récupère fullName depuis le contexte

  const goToPreviEdit = () => {
    navigate("/PreGridEdit");
  };

  const goToSeePrevi = () => {
    navigate("/SeePrevi");
  };

  const goToManageData = () => {
    navigate("/ManageData");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-around items-center">
        <div className="flex justify-center items-center w-full h-full">
          <h1 className="text-white text-4xl font-bold text-outline bg-black bg-opacity-55 p-4 rounded-2xl mt-10">
            Bienvenue, {fullName} !
          </h1>
        </div>
        <div className="flex justify-between items-center w-full max-w-[1200px] mt-8 px-8">
          {/* Modify Previ Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
            onClick={goToPreviEdit}
          >
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <div className="text-white text-6xl font-bold">
                <svg
                  className="size-[70px] md:size-[100px] lg:size-[200px]"
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M168.65 141.421L144.323 135.601L117.204 108.461L138.097 87.5774C142.95 89.2818 147.994 90.1146 153.015 90.1142C164.759 90.1134 176.361 85.5539 184.989 76.9347C198.348 63.5896 201.968 43.1297 193.998 26.0239L190.303 18.0923L168.311 40.0501L158.099 29.8484L180.097 7.88489L172.136 4.18231C155.023 -3.77585 134.554 -0.159582 121.201 13.1798C108.886 25.4828 104.847 43.8341 110.537 60.0281L102.317 68.244L41.7414 7.62515C37.2174 3.08242 31.1926 0.576679 24.7763 0.569317C24.7669 0.569317 24.7583 0.569317 24.7489 0.569317C18.3338 0.569317 12.3038 3.06606 7.76588 7.60266C3.22309 12.1491 0.723432 18.1913 0.726702 24.6168C0.729971 31.0374 3.23167 37.0744 7.76997 41.6134L68.3278 102.217L60.0903 110.451C43.8842 104.758 25.5148 108.79 13.198 121.094C-0.160604 134.439 -3.78135 154.898 4.18927 172.004L7.88481 179.936L29.8757 157.978L40.0877 168.18L18.0902 190.143L26.0519 193.846C32.1065 196.661 38.5796 198.028 45.011 198.028C56.7565 198.027 68.358 193.468 76.9863 184.848C89.3015 172.545 93.3399 154.194 87.6507 138L108.528 117.132L135.653 144.278L141.468 168.625L172.818 200L200 172.796L168.65 141.421ZM123.304 58.9004C117.508 46.458 120.144 31.5741 129.863 21.8644C137.334 14.4012 147.861 11.1158 157.993 12.6203L140.741 29.8459L168.309 57.3854L185.573 40.1479C187.084 50.2665 183.798 60.7861 176.327 68.2493C166.599 77.9676 151.687 80.6009 139.219 74.802L135.335 72.9953L121.192 87.1311L110.988 76.9196L125.118 62.7961L123.304 58.9004ZM12.9879 24.6103C12.9863 21.4648 14.2108 18.5063 16.4333 16.2815C18.6539 14.0621 21.6064 12.8399 24.7493 12.8399C27.9009 12.8436 30.8464 14.0678 33.0645 16.2946L112.516 95.8027L95.8776 112.434L16.4387 32.9349C14.2153 30.711 12.9896 27.7545 12.9879 24.6103ZM68.3241 176.164C60.8529 183.627 50.3254 186.912 40.194 185.408L57.446 168.182L29.8782 140.643L12.6144 157.88C11.103 147.762 14.3894 137.242 21.8606 129.779C31.5882 120.061 46.5008 117.427 58.968 123.226L62.8528 125.032L76.9977 110.894L87.2019 121.106L73.0696 135.232L74.8843 139.128C80.6802 151.57 78.0436 166.453 68.3241 176.164ZM152.588 162.4L149.496 149.456L162.43 152.55L182.661 172.796L172.818 182.646L152.588 162.4Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <p className="text-white text-xl text-center pb-6">
              Modifier le prévisionnel
            </p>
          </div>

          {/* Insert Data Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
            onClick={goToManageData}
          >
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <img
                src="/images/options.svg"
                className="size-[70px] md:size-[100px] lg:size-[200px]"
              />
            </div>
            <p className="text-white text-xl text-center pb-6">
              Gestion des données
            </p>
          </div>

          {/* See Previ Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 cursor-not-allowed"
            disabled
          >
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <img
                src="/images/previ-edit.svg"
                alt="icone"
                className="size-[70px] md:size-[100px] lg:size-[200px]"
              />
            </div>
            <p className="text-white text-xl text-center pb-6">
              Consulter le prévisionnel
            </p>
            </div>
            
          </div>
            
          </div>

    </>
  );
};

export default HomePage;
