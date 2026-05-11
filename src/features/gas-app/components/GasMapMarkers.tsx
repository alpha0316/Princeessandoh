import riderIconUrl from '../../../assets/gas-app/rider-icon.svg'
import stationIconUrl from '../../../assets/gas-app/station-icon.svg'

export function GasRiderMarker() {
  return <img src={riderIconUrl} width={43} height={46} alt="" style={{ display: 'block' }} />
}

export function GasStationMarker() {
  return <img src={stationIconUrl} width={36} height={40} alt="" style={{ display: 'block' }} />
}
