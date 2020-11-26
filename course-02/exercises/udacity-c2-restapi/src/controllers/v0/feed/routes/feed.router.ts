import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', async (req: Request, res: Response) => {

    //"unpack" the parameters that were in the request into an object called id
    let { id } = req.params;

    /*
    here for debugging
    console.log('Does this do what I think?');
    console.log(req.params.id);
    console.log(id);
    console.log(typeof id);
    */

    //response if no id is sent
    if ( !req.params.id ) {
        return res.status(400).send(`Please provide an id`);
    }

    //used the findByPk method from sequelize to find the specific feed item
    //referenced by the id
    const item: FeedItem = await FeedItem.findByPk(id);
    
    //response if item is not found
    if( !item ) {
        return res.status(404).send('There is no feed item with that id.')
    }

    //send that feed item back normally
    res.status(200).send(item);

      



})

// update a specific resource
router.patch('/:id', 
    requireAuth, 
    async (req: Request, res: Response) => {
        //@TODO try it yourself

        //skipping the case of not having an id at all


        //unpack the request into the id object
        let { id } = req.params;

        //use findByPk from sequelize to get the FeedItem referenced by that id
        //and put it in item
        const item: FeedItem = await FeedItem.findByPk(id);

        if( !item ) {
            return res.status(404).send('That item wasn\'t found!');
        }

        //Check what's included with the patch body
        //Replace url/caption
        if(req.body.caption) {
            item.caption = req.body.caption;
        }
        
        if(req.body.url) {
            item.url = req.body.url;
        }
        
        //Save the item permanently to the database using the sequelize save method
        const saved_item = item.save();

        //send item back. for some reason, it didn't like saved item.
        res.status(200).json(item);
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    requireAuth, 
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    requireAuth, 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;