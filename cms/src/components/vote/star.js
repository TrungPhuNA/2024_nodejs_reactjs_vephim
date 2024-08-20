import React from "react";
import {StarOutlined} from '@ant-design/icons'


export const StarIcons = ( props ) =>
{
	return (
		<div className="review">
			{
				[ ...Array( 5 ) ].map( ( item, index ) =>
				{
					if ( index < props.vote_number )
					{
						return (
							<StarOutlined key={ index }
							className={ `star active
						${ index > 0 ? 'ml-2' : '' }` }/> 
						);
					}
					return (
						<StarOutlined key={ index }
						className={ `star
					${ index > 0 ? 'ml-2' : '' }` }/> 
					);
				} )
			}
		</div>
	);
};
