import {PageHeader} from '../utils/pageUtils'

export default function Page({name, children}) {

    return (
      <div>
        <PageHeader text={name} />
        <div className='p-4'>
          {children}
        </div>
      </div>
    );
  }