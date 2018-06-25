import { connect } from 'react-redux'

import Header from './component'

import { setPage } from './actions'

import client from '../utils/rpc'

const mapStateToProps = state => state.page

const mapDispatchToProps = dispatch => ({
  onPageChange: page => {
    dispatch(setPage(page))
    //location.reload()

    client.invoke('echo', 'server ready', (error, res) => {
      if (error || res !== 'server ready') {
        console.error(error)
      } else {
        console.log('server is ready')
      }
    })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
