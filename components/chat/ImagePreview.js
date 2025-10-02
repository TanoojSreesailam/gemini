/* eslint-disable @next/next/no-img-element */
// src/components/chat/ImagePreview.js
const ImagePreview = ({ base64Image, onRemove }) => {
  if (!base64Image) return null;

  return (
    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 max-w-4xl w-full p-4 bg-white dark:bg-gray-900 shadow-2xl rounded-xl mb-4 border dark:border-gray-700">
      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-lg overflow-hidden border-2 border-blue-500">
        <img
          src={base64Image}
          alt="Image preview"
          className="w-full h-full object-cover"
        />

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition shadow-md"
          title="Remove Image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p className="text-center mt-2 text-sm dark:text-gray-400">
        Image attached, ready to send.
      </p>
    </div>
  );
};

export default ImagePreview;
