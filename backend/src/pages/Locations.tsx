import React, { useState } from 'react'
import Master from '../components/Master'
import { strings } from '../lang/locations'
import Search from '../components/Search'
import LocationList from '../components/LocationList'
import InfoBox from '../components/InfoBox'
import { Button } from '@mui/material'
import * as bookcarsTypes from 'bookcars-types'

import '../assets/css/locations.css'

const Locations = () => {
  const [keyword, setKeyword] = useState('')
  const [rowCount, setRowCount] = useState(-1)
  const [reload, setReload] = useState(false)

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword)
    setReload(newKeyword === keyword)
  }

  const handleLocationListLoad: bookcarsTypes.DataEvent<bookcarsTypes.Location> = (data) => {
    if (data) {
      setRowCount(data.rowCount)
      setReload(false)
    }
  }

  const handleLocationDelete = (rowCount: number) => {
    setRowCount(rowCount)
  }

  const onLoad = (user?: bookcarsTypes.User) => {
  }

  return (
    <Master onLoad={onLoad} strict>
      <div className="locations">
        <div className="col-1">
          <div className="col-1-container">
            <Search className="search" onSubmit={handleSearch} />

            {rowCount > -1 && (
              <Button variant="contained" className="btn-primary new-location" size="small" href="/create-location">
                {strings.NEW_LOCATION}
              </Button>
            )}

            {rowCount > 0 && <InfoBox value={`${rowCount} ${rowCount > 1 ? strings.LOCATIONS : strings.LOCATION}`} className="location-count" />}
          </div>
        </div>
        <div className="col-2">
          <LocationList keyword={keyword} reload={reload} onLoad={handleLocationListLoad} onDelete={handleLocationDelete} />
        </div>
      </div>
    </Master>
  )
}

export default Locations