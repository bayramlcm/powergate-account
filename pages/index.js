import * as React from 'react'
import * as System from 'slate-react-system'

import { css } from '@emotion/react'
import { createPow } from '@textile/powergate-client'

const STYLES_PAGE = css`
  margin: 0;
  padding: 0;
`

export default class TestPage extends React.Component {
  PG = null
  state = { token: null, info: null, addrsList: [] }

  _handleCreateToken = async () => {
    this.PG = createPow({ host: 'http://0.0.0.0:6002' })

    const FFS = await this.PG.ffs.create()

    this.setState({ token: FFS.token ? FFS.token : null })

    this.PG.setToken(FFS.token)
  }

  _handleCreateAddress = async ({ name, type, makeDefault }) => {
    const response = await this.PG.ffs.newAddr(name, type, makeDefault)
  }

  _handleSendFilecoin = async ({ source, target, amount }) => {
    const response = await this.PG.ffs.sendFil(source, target, amount)
  }

  _handleRefresh = async () => {
    const { addrsList } = await this.PG.ffs.addrs()
    const { info } = await this.PG.ffs.info()
    this.setState({ addrsList, info })
  }

  render() {
    const { token, info } = this.state

    return (
      <div css={STYLES_PAGE}>
        <System.CreateToken onClick={this._handleCreateToken}>
          Hello There
        </System.CreateToken>

        <System.ButtonPrimary onClick={this._handleRefresh}>
          Refresh
        </System.ButtonPrimary>

        {info ? <System.FilecoinBalancesList data={info.balancesList} /> : null}

        {info ? (
          <System.CreateFilecoinAddress onSubmit={this._handleCreateAddress} />
        ) : null}

        {info ? (
          <System.SendAddressFilecoin onSubmit={this._handleSendFilecoin} />
        ) : null}
      </div>
    )
  }
}