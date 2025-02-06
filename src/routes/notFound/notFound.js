import {PageHeader} from '../../utils/pageUtils'
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
      <div>
        <PageHeader text="Page Not Found"/>
        <p>
          <Link className='text-blue-500 hover:text-blue-700' to="/">Go to the home page</Link>
        </p>
      </div>
    );
  }