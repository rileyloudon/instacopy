import PropTypes from 'prop-types';
import { useContext, useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import './PostDropdown.css';

const PostDropdown = ({ owner, id }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const postDropDownRef = useRef(null);
  const [postDropdownOpen, setPostDropdownOpen] = useState(false);

  const handleClick = () => setPostDropdownOpen(!postDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        postDropDownRef.current !== null &&
        !postDropDownRef.current.contains(e.traget)
      ) {
        setPostDropdownOpen(!postDropdownOpen);
      }
    };

    if (postDropdownOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [postDropdownOpen]);

  return (
    <div className='post-dropdown-container'>
      <Dots className='dots' onClick={handleClick} />
      <div
        ref={postDropDownRef}
        className={`post-dropdown ${postDropdownOpen ? 'displayed' : ''}`}
      >
        <button
          type='button'
          onClick={() => {
            history.push(`/${owner}/${id}`);
            window.scrollTo(0, 0);
          }}
        >
          View Post
        </button>
        {owner === user.username && (
          <button
            type='button'
            onClick={() => history.push(`/${owner}/${id}/edit`)}
          >
            Edit Post
          </button>
        )}
      </div>
    </div>
  );
};

PostDropdown.propTypes = {
  owner: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default PostDropdown;
